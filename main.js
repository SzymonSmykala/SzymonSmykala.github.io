const REELS = [
  { id: "DAO8Eo4tLlJ", client: "cracovia" },
  { id: "DClnujLIyyx", client: "cracovia" },
  { id: "DIJ2EKOo5Zq", client: "cracovia" },
  { id: "DG_a5dkoS28", client: "cracovia" },
  { id: "DLIWcilt04c", client: "kcc" },
  { id: "DLNL6cmtd9a", client: "kcc" },
  { id: "DO4Emh2CFl_", client: "cracovia" },
  { id: "DAVNmo_tpCy", client: "cracovia" },
  { id: "DW0ZzoDtcd4", client: "golec" },
];

const CLIENTS = {
  cracovia: "Cracovia Maraton",
  kcc: "Krakow City Cup",
  golec: "Paulina Golec",
};

const base = document.documentElement.dataset.base || "";
const grid = document.getElementById("reels");
const { playLabel, loadingLabel } = grid.dataset;

grid.innerHTML = REELS.map(({ id, client }) => `
  <article class="reel" data-client="${client}" data-id="${id}">
    <button class="reel__cover" type="button" aria-label="${playLabel}: ${CLIENTS[client]} (Instagram)">
      <img src="${base}assets/covers/${id}.jpg" alt="" loading="lazy" width="405" height="720">
      <span class="reel__play" aria-hidden="true"></span>
      <span class="reel__client">${CLIENTS[client]}</span>
    </button>
  </article>`).join("");

// Instagram's player (and Meta cookies) loads only after the visitor clicks a cover
let embedScript;
function processEmbeds() {
  if (window.instgrm) {
    window.instgrm.Embeds.process();
  } else if (!embedScript) {
    embedScript = document.createElement("script");
    embedScript.src = "https://www.instagram.com/embed.js";
    embedScript.async = true;
    document.body.appendChild(embedScript);
  }
}

grid.addEventListener("click", (e) => {
  const cover = e.target.closest(".reel__cover");
  if (!cover) return;
  const reel = cover.closest(".reel");
  const url = `https://www.instagram.com/reel/${reel.dataset.id}/`;
  reel.classList.add("is-playing");
  reel.innerHTML = `
    <blockquote class="instagram-media" data-instgrm-permalink="${url}?utm_source=ig_embed" data-instgrm-version="14">
      <a class="reel__fallback" href="${url}" target="_blank" rel="noopener">${loadingLabel}</a>
    </blockquote>`;
  processEmbeds();
});

// Client filters
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c === chip));
    const f = chip.dataset.filter;
    grid.querySelectorAll(".reel").forEach((r) => {
      r.hidden = f !== "all" && r.dataset.client !== f;
    });
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
