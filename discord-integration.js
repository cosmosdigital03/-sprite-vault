(() => {
  "use strict";

  const config = window.SPRITE_VAULT_CONFIG || {};
  const byId = id => document.getElementById(id);
  const ui = {
    panel: byId("discordRolePanel"),
    avatar: byId("discordUserAvatar"),
    userName: byId("discordUserName"),
    eligibleRole: byId("discordEligibleRole"),
    ownedCount: byId("discordOwnedCount"),
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

  function eligibleRole(count, total) {
    const thresholds = Array.isArray(config.roleThresholds) ? config.roleThresholds : [];
    const exactCompletion = thresholds.find(item => item.max === null && count >= total && total > 0);
    if (exactCompletion) return exactCompletion;
    return thresholds.find(item => item.max !== null && count >= item.min && count <= item.max) || null;
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
    const role = eligibleRole(data.owned, data.total);
    ui.ownedCount.textContent = data.owned;
    ui.totalCount.textContent = data.total;
    ui.eligibleRole.textContent = role?.name || "Marca al menos 1 Sprite";

    if (data.isPublicView) {
      ui.panel.hidden = true;
      return;
    }

    if (session && data.owned === 0) {
      ui.sync.disabled = true;
      setMessage("Marca al menos un Sprite antes de sincronizar un rol.");
    } else if (session && !syncing) {
      ui.sync.disabled = false;
      setMessage("La sincronización reemplaza solamente tus roles de colección anteriores.");
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
    ui.sync.disabled = snapshot().owned === 0;
    setStatus("Discord conectado · listo para sincronizar", "ready");
    renderCollection();
  }

  async function connectDiscord() {
    if (!configured) {
      setStatus("Falta conectar el proyecto de Supabase", "warning");
      setMessage("La interfaz está lista. Completa discord-config.js y los pasos del README para activarla.");
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
    if (data.owned === 0) return;

    syncing = true;
    ui.sync.disabled = true;
    ui.sync.textContent = "Sincronizando…";
    ui.join.hidden = true;
    setStatus("Actualizando tu rol en Sprite Vault…", "warning");

    try {
      const { data: result, error } = await supabase.functions.invoke(
        config.functionName || "sync-discord-role",
        {
          body: {
            ownedSpriteIds: data.ownedSpriteIds,
            masteredSpriteIds: data.masteredSpriteIds,
            totalSprites: data.total
          }
        }
      );

      if (error) throw error;

      if (result?.code === "not_member") {
        setStatus("Tu Discord no está dentro de Sprite Vault", "warning");
        setMessage("Entra al servidor y vuelve a pulsar Sincronizar rol.");
        ui.join.hidden = false;
        return;
      }

      if (!result?.ok) {
        throw new Error(result?.message || "No se pudo sincronizar el rol.");
      }

      setStatus("Rol sincronizado correctamente", "ready");
      setMessage(`Recibiste ${result.roleName}. Sincronizado con ${result.ownedCount} Sprites.`);
    } catch (error) {
      console.error("Discord role sync failed", error);
      setStatus("No se pudo sincronizar el rol", "error");
      setMessage(error?.message || "Revisa la configuración del bot y vuelve a intentarlo.");
    } finally {
      syncing = false;
      ui.sync.textContent = "Sincronizar rol";
      ui.sync.disabled = !session || snapshot().owned === 0;
    }
  }

  async function initialize() {
    renderCollection();
    ui.join.href = config.discordInvite || "https://discord.gg/7AAnVUPZc";

    if (!configured) {
      ui.connect.disabled = false;
      ui.sync.disabled = true;
      setStatus("Integración preparada · falta conectar Supabase", "warning");
      setMessage("El tracker ya está listo para visitantes. La activación de roles requiere tus claves públicas e IDs privados.");
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
