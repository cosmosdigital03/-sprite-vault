(() => {
  "use strict";

  const config = window.SPRITE_VAULT_CONFIG || {};
  const byId = id => document.getElementById(id);
  const ui = {
    panel: byId("discordRolePanel"),
    avatar: byId("discordUserAvatar"),
    userName: byId("discordUserName"),
    collectionRole: byId("discordEligibleCollectionRole"),
    masteryRole: byId("discordEligibleMasteryRole"),
    specialRoles: byId("discordEligibleSpecialRoles"),
    ownedCount: byId("discordOwnedCount"),
    masteredCount: byId("discordMasteredCount"),
    totalCount: byId("discordTotalCount"),
    status: byId("discordSyncStatus"),
    statusText: byId("discordStatusText"),
    message: byId("discordRoleMessage"),
    connect: byId("connectDiscordButton"),
    sync: byId("syncDiscordRoleButton"),
    join: byId("joinDiscordRoleButton"),
    disconnect: byId("disconnectDiscordButton")
  };

  if (!ui.panel || !window.SpriteVaultCollection) return;

  let supabase = null;
  let session = null;
  let syncing = false;

  const configured = Boolean(
    config.supabaseUrl &&
    config.supabasePublishableKey &&
    window.supabase?.createClient
  );

  function snapshot() {
    return window.SpriteVaultCollection.getSnapshot();
  }

  function roleForCount(thresholds, count) {
    if (!Array.isArray(thresholds)) return null;
    return thresholds.find(item => (
      count >= Number(item.min) &&
      (item.max === null || count <= Number(item.max))
    )) || null;
  }

  function specialRolesFor(keys) {
    const ownedKeys = new Set(Array.isArray(keys) ? keys : []);
    return (Array.isArray(config.specialRoles) ? config.specialRoles : [])
      .filter(item => ownedKeys.has(item.key));
  }

  function setStatus(text, mode = "") {
    ui.statusText.textContent = text;
    ui.status.classList.remove("is-ready", "is-warning", "is-error");
    if (mode) ui.status.classList.add(`is-${mode}`);
  }

  function setMessage(text) {
    ui.message.textContent = text;
  }

  function renderCollection() {
    const data = snapshot();
    const collectionRole = roleForCount(config.collectionRoleThresholds, data.owned);
    const masteryRole = roleForCount(config.masteryRoleThresholds, data.mastered);
    const specials = specialRolesFor(data.ownedSpecialKeys);

    ui.ownedCount.textContent = data.owned;
    ui.masteredCount.textContent = data.mastered;
    ui.totalCount.textContent = data.total;
    ui.collectionRole.textContent = collectionRole?.name || "Disponible al llegar a 10";
    ui.masteryRole.textContent = masteryRole?.name || "Disponible al dominar 5";
    ui.specialRoles.textContent = specials.length
      ? specials.map(item => item.name).join(" · ")
      : "Ninguno todavía";

    if (data.isPublicView) {
      ui.panel.hidden = true;
      return;
    }

    if (session && data.owned === 0 && data.mastered === 0) {
      ui.sync.disabled = true;
      setMessage("Marca tus Sprites antes de sincronizar tus roles.");
    } else if (session && !syncing) {
      ui.sync.disabled = false;
      setMessage("Se actualiza tu nivel de Colección, tu nivel de Dominio y tus roles Especiales.");
    }
  }

  function discordIdentity(user) {
    return user?.identities?.find(identity => identity.provider === "discord") || null;
  }

  function renderSession(nextSession) {
    session = nextSession;
    const user = session?.user;
    const identity = discordIdentity(user);
    const metadata = identity?.identity_data || user?.user_metadata || {};

    if (!user) {
      ui.userName.textContent = "No conectada";
      ui.avatar.innerHTML = "D";
      ui.connect.hidden = false;
      ui.disconnect.hidden = true;
      ui.sync.disabled = true;
      ui.join.hidden = true;
      if (configured) setStatus("Conecta Discord para activar tus roles", "warning");
      renderCollection();
      return;
    }

    const displayName = metadata.global_name || metadata.full_name || metadata.name || metadata.user_name || "Usuario de Discord";
    const username = metadata.custom_claims?.global_name || metadata.preferred_username || metadata.user_name || "";
    ui.userName.textContent = username && username !== displayName ? `${displayName} · @${username}` : displayName;

    if (metadata.avatar_url) {
      const img = document.createElement("img");
      img.src = metadata.avatar_url;
      img.alt = "";
      ui.avatar.replaceChildren(img);
    } else {
      ui.avatar.textContent = displayName.slice(0, 1).toUpperCase();
    }

    ui.connect.hidden = true;
    ui.disconnect.hidden = false;
    ui.sync.disabled = snapshot().owned === 0 && snapshot().mastered === 0;
    setStatus("Discord conectado · listo para sincronizar", "ready");
    renderCollection();
  }

  async function connectDiscord() {
    if (!configured) {
      setStatus("Falta conectar el proyecto de Supabase", "warning");
      setMessage("Completa discord-config.js y los pasos del README para activar la integración.");
      return;
    }

    ui.connect.disabled = true;
    setStatus("Abriendo Discord…", "warning");

    const redirectTo = `${location.origin}${location.pathname}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo,
        scopes: "identify email"
      }
    });

    if (error) {
      ui.connect.disabled = false;
      setStatus("No se pudo abrir Discord", "error");
      setMessage(error.message);
    }
  }

  async function disconnectDiscord() {
    if (!supabase) return;
    ui.disconnect.disabled = true;
    const { error } = await supabase.auth.signOut();
    ui.disconnect.disabled = false;
    if (error) {
      setStatus("No se pudo cerrar la sesión", "error");
      setMessage(error.message);
      return;
    }
    renderSession(null);
    setMessage("Tu colección continúa guardada en este navegador.");
  }

  async function syncDiscordRole() {
    if (!supabase || !session || syncing) return;
    const data = snapshot();
    if (data.owned === 0 && data.mastered === 0) return;

    syncing = true;
    ui.sync.disabled = true;
    ui.sync.textContent = "Sincronizando…";
    ui.join.hidden = true;
    setStatus("Actualizando tus roles en Sprite Vault…", "warning");

    try {
      const { data: result, error } = await supabase.functions.invoke(
        config.functionName || "sync-discord-role",
        {
          body: {
            ownedSpriteIds: data.ownedSpriteIds,
            masteredSpriteIds: data.masteredSpriteIds,
            ownedSpecialKeys: data.ownedSpecialKeys,
            totalSprites: data.total
          }
        }
      );

      if (error) throw error;

      if (result?.code === "not_member") {
        setStatus("Tu Discord no está dentro de Sprite Vault", "warning");
        setMessage("Entra al servidor y vuelve a pulsar Sincronizar roles.");
        ui.join.hidden = false;
        return;
      }

      if (!result?.ok) {
        throw new Error(result?.message || "No se pudieron sincronizar los roles.");
      }

      const names = Array.isArray(result.roleNames) && result.roleNames.length
        ? result.roleNames.join(" · ")
        : "ningún rol todavía";
      setStatus("Roles sincronizados correctamente", "ready");
      setMessage(`Roles actuales: ${names}. Colección: ${result.ownedCount}; Dominados: ${result.masteredCount}.`);
    } catch (error) {
      console.error("Discord role sync failed", error);
      setStatus("No se pudieron sincronizar los roles", "error");
      setMessage(error?.message || "Revisa la configuración del bot y vuelve a intentarlo.");
    } finally {
      syncing = false;
      ui.sync.textContent = "Sincronizar roles";
      const current = snapshot();
      ui.sync.disabled = !session || (current.owned === 0 && current.mastered === 0);
    }
  }

  async function initialize() {
    renderCollection();
    ui.join.href = config.discordInvite || "https://discord.gg/7AAnVUPZc";

    if (!configured) {
      ui.connect.disabled = false;
      ui.sync.disabled = true;
      setStatus("Integración preparada · falta conectar Supabase", "warning");
      setMessage("El tracker funciona para visitantes. La activación de roles requiere tus claves públicas e IDs privados.");
      return;
    }

    supabase = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        flowType: "pkce"
      }
    });

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      setStatus("No se pudo leer la sesión", "error");
      setMessage(error.message);
    } else {
      renderSession(data.session);
    }

    supabase.auth.onAuthStateChange((_event, nextSession) => {
      window.setTimeout(() => renderSession(nextSession), 0);
    });
  }

  ui.connect.addEventListener("click", connectDiscord);
  ui.disconnect.addEventListener("click", disconnectDiscord);
  ui.sync.addEventListener("click", syncDiscordRole);
  window.addEventListener("spritevault:collectionchange", renderCollection);

  initialize();
})();
