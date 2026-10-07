/* /* =====================================================
   app.js
   Puja Website — Combined Version
   Supabase + Countdown + Clothing Poll + Media + Online
   ===================================================== */


/* ================= SUPABASE ================= */

/* Supabase dashboard থেকে এই দুইটি value বসাও */
const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL";
const SUPABASE_KEY = "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY";

const configured =
  !SUPABASE_URL.startsWith("PASTE_") &&
  !SUPABASE_KEY.startsWith("PASTE_");

const sb = configured
  ? window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    )
  : null;


/* ================= ELEMENT HELPER ================= */

const $ = id => document.getElementById(id);


/* =====================================================
   COUNTDOWN
   ===================================================== */

/* মহালয়া — ১০ অক্টোবর ২০২৬ */
function startMahalayaCountdown() {

  const target =
    new Date("2026-10-10T00:00:00+06:00").getTime();

  function update() {

    const now = new Date().getTime();
    const diff = target - now;

    const days = $("mahalaya-days");
    const hours = $("mahalaya-hours");
    const minutes = $("mahalaya-minutes");
    const seconds = $("mahalaya-seconds");

    if (!days || !hours || !minutes || !seconds) {
      return;
    }

    if (diff <= 0) {

      days.textContent = "00";
      hours.textContent = "00";
      minutes.textContent = "00";
      seconds.textContent = "00";

      return;
    }

    days.textContent =
      String(
        Math.floor(
          diff / (1000 * 60 * 60 * 24)
        )
      ).padStart(2, "0");

    hours.textContent =
      String(
        Math.floor(
          (diff / (1000 * 60 * 60)) % 24
        )
      ).padStart(2, "0");

    minutes.textContent =
      String(
        Math.floor(
          (diff / (1000 * 60)) % 60
        )
      ).padStart(2, "0");

    seconds.textContent =
      String(
        Math.floor(
          (diff / 1000) % 60
        )
      ).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}


/* দুর্গাপূজা — ষষ্ঠী ১৬ অক্টোবর ২০২৬ */
function startPujaCountdown() {

  const target =
    new Date("2026-10-16T00:00:00+06:00").getTime();

  function update() {

    const now = new Date().getTime();
    const diff = target - now;

    const days = $("puja-days");
    const hours = $("puja-hours");
    const minutes = $("puja-minutes");
    const seconds = $("puja-seconds");

    if (!days || !hours || !minutes || !seconds) {
      return;
    }

    if (diff <= 0) {

      days.textContent = "00";
      hours.textContent = "00";
      minutes.textContent = "00";
      seconds.textContent = "00";

      return;
    }

    days.textContent =
      String(
        Math.floor(
          diff / (1000 * 60 * 60 * 24)
        )
      ).padStart(2, "0");

    hours.textContent =
      String(
        Math.floor(
          (diff / (1000 * 60 * 60)) % 24
        )
      ).padStart(2, "0");

    minutes.textContent =
      String(
        Math.floor(
          (diff / (1000 * 60)) % 60
        )
      ).padStart(2, "0");

    seconds.textContent =
      String(
        Math.floor(
          (diff / 1000) % 60
        )
      ).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}


/* পুরোনো countdown element থাকলে সেটাও চালু রাখবে */
const PUJA_DATE =
  new Date("2026-10-16T00:00:00+06:00");

function oldCountdown() {

  const el = $("countdown");

  if (!el) return;

  const diff =
    PUJA_DATE.getTime() -
    new Date().getTime();

  if (diff <= 0) {

    el.textContent = "শুভ পুজো! 🌺";
    return;

  }

  const d =
    Math.floor(
      diff / 86400000
    );

  const h =
    Math.floor(
      (diff % 86400000) /
      3600000
    );

  const m =
    Math.floor(
      (diff % 3600000) /
      60000
    );

  const s =
    Math.floor(
      (diff % 60000) /
      1000
    );

  el.innerHTML =
    `<span>${d} দিন</span>
     <span>${h} ঘণ্টা</span>
     <span>${m} মিনিট</span>
     <span>${s} সেকেন্ড</span>`;
}


/* Countdown শুরু */
startMahalayaCountdown();
startPujaCountdown();

setInterval(oldCountdown, 1000);
oldCountdown();


/* =====================================================
   CLOTHING POLL
   ===================================================== */

let voted = false;


/* নতুন পোশাক নির্বাচন */
const clothingOptions = [
  {
    key: "tshirt",
    name: "টি-শার্ট"
  },
  {
    key: "ganji",
    name: "গেঞ্জি"
  },
  {
    key: "shirt",
    name: "হাফ-স্লিভ শার্ট"
  },
  {
    key: "jeans",
    name: "জিন্স + টি-শার্ট"
  }
];


/* নতুন poll-এর local votes */
const defaultClothingVotes = {
  tshirt: 0,
  ganji: 0,
  shirt: 0,
  jeans: 0
};


let clothingVotes;

try {

  clothingVotes =
    JSON.parse(
      localStorage.getItem(
        "puja_clothing_votes"
      )
    ) || {
      ...defaultClothingVotes
    };

} catch (error) {

  clothingVotes = {
    ...defaultClothingVotes
  };

}


/* ================= OLD SUPABASE POLL ================= */

function renderPoll(rows) {

  const totals =
    Array(6).fill(0);

  (rows || []).forEach(r => {

    if (
      r.option >= 1 &&
      r.option <= 6
    ) {
      totals[r.option - 1]++;
    }

  });

  const total =
    totals.reduce(
      (a, b) => a + b,
      0
    );


  const pollOptions =
    $("pollOptions");

  const pollResults =
    $("pollResults");


  if (pollOptions) {

    pollOptions.innerHTML =
      Array.from(
        { length: 6 },
        (_, i) =>
          `<button class="${
            voted ? "selected" : ""
          }"
          onclick="vote(${i + 1})">
            ${i + 1} সেট
          </button>`
      ).join("");

  }


  if (pollResults) {

    pollResults.innerHTML =
      totals.map((n, i) => {

        const pct =
          total
            ? Math.round(
                n * 1000 / total
              ) / 10
            : 0;

        return `
          <div class="result">

            <div class="result-head">
              <span>${i + 1} সেট</span>
              <b>${pct}% (${n})</b>
            </div>

            <div class="bar">
              <div
                class="fill"
                style="width:${pct}%">
              </div>
            </div>

          </div>
        `;

      }).join("");

  }

}


/* ================= NEW CLOTHING RESULTS ================= */

function saveClothingVotes() {

  localStorage.setItem(
    "puja_clothing_votes",
    JSON.stringify(
      clothingVotes
    )
  );

}


function showClothingResults() {

  const resultBox =
    $("poll-results");

  if (!resultBox) return;


  const total =
    Object.values(
      clothingVotes
    ).reduce(
      (sum, value) =>
        sum + value,
      0
    );


  if (total === 0) {

    resultBox.innerHTML =
      `<p style="
        text-align:center;
        color:#777;
      ">
        এখনো কোনো ভোট দেওয়া হয়নি।
      </p>`;

    return;
  }


  resultBox.innerHTML =
    clothingOptions
      .map(option => {

        const percentage =
          Math.round(
            (
              clothingVotes[
                option.key
              ] / total
            ) * 100
          );


        return `
          <div class="poll-result">

            <div class="poll-result-top">
              <span>
                ${option.name}
              </span>

              <strong>
                ${percentage}%
              </strong>
            </div>

            <div class="poll-bar">

              <div
                class="poll-bar-fill"
                style="width:${percentage}%">
              </div>

            </div>

          </div>
        `;

      })
      .join("");

}


/* ================= CLOTHING SELECTION ================= */

document
  .querySelectorAll(
    'input[name="clothing"]'
  )
  .forEach(input => {

    input.addEventListener(
      "change",
      function () {

        const selected =
          this.value;


        if (
          !localStorage.getItem(
            "puja_clothing_voted"
          )
        ) {

          if (
            Object.prototype
              .hasOwnProperty.call(
                clothingVotes,
                selected
              )
          ) {

            clothingVotes[
              selected
            ]++;

            saveClothingVotes();

            localStorage.setItem(
              "puja_clothing_voted",
              selected
            );

          }

        }

        showClothingResults();

      }
    );

  });


showClothingResults();


/* =====================================================
   SUPABASE CLOTHING POLL
   ===================================================== */

async function loadPoll() {

  if (!sb) {

    renderPoll([]);
    return;

  }


  const {
    data,
    error
  } =
    await sb
      .from("clothes_votes")
      .select("option");


  if (error) {

    console.error(error);
    renderPoll([]);
    return;

  }


  renderPoll(data);

}


async function vote(option) {

  if (voted) {

    alert(
      "তুমি ইতিমধ্যে ভোট দিয়েছো।"
    );

    return;

  }


  if (!sb) {

    alert(
      "Supabase setup করা হয়নি।"
    );

    return;

  }


  const key =
    "puja_vote_2026";


  if (
    localStorage.getItem(key)
  ) {

    voted = true;

    alert(
      "তুমি ইতিমধ্যে ভোট দিয়েছো।"
    );

    return;

  }


  const {
    error
  } =
    await sb
      .from("clothes_votes")
      .insert({
        option
      });


  if (error) {

    alert(
      "ভোট দেওয়া যায়নি।"
    );

    console.error(error);

    return;

  }


  localStorage.setItem(
    key,
    "1"
  );

  voted = true;

  loadPoll();

}


window.vote = vote;


/* =====================================================
   MEDIA
   ===================================================== */

async function loadMedia() {

  if (!sb) return;


  const {
    data,
    error
  } =
    await sb
      .from("media")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );


  if (error) {

    console.error(error);
    return;

  }


  const photos =
    data.filter(
      x => x.type === "photo"
    );


  const greetings =
    data.filter(
      x => x.type === "greeting"
    );


  const songs =
    data
      .filter(
        x => x.type === "song"
      )
      .slice(0, 5);


  const dhak =
    data.find(
      x => x.type === "dhak"
    );


  const photosBox =
    $("photos");

  if (photosBox) {

    photosBox.innerHTML =
      photos
        .map(
          x =>
            `<img
              src="${x.url}"
              alt="পূজা ফটো"
              loading="lazy"
            >`
        )
        .join("");

  }


  const photosEmpty =
    $("photosEmpty");

  if (photosEmpty) {

    photosEmpty.style.display =
      photos.length
        ? "none"
        : "block";

  }


  const greetingsBox =
    $("greetings");

  if (greetingsBox) {

    greetingsBox.innerHTML =
      greetings
        .map(
          x =>
            `<div class="greeting">
              <b>
                ${escapeHtml(
                  x.title ||
                  "শুভ শারদীয়া"
                )}
              </b>

              ${
                x.caption
                  ? `<p>
                      ${escapeHtml(
                        x.caption
                      )}
                    </p>`
                  : ""
              }

            </div>`
        )
        .join("");

  }


  const greetingsEmpty =
    $("greetingsEmpty");

  if (greetingsEmpty) {

    greetingsEmpty.style.display =
      greetings.length
        ? "none"
        : "block";

  }


  const playlist =
    $("playlist");

  if (playlist) {

    playlist.innerHTML =
      songs
        .map(
          (x, i) =>
            `<div class="song">

              <b>
                ${i + 1}.
                ${escapeHtml(
                  x.title ||
                  "পুজোর গান"
                )}
              </b>

              <audio
                controls
                src="${x.url}">
              </audio>

            </div>`
        )
        .join("");

  }


  const playlistEmpty =
    $("playlistEmpty");

  if (playlistEmpty) {

    playlistEmpty.style.display =
      songs.length
        ? "none"
        : "block";

  }


  const dhakPlayer =
    $("dhakPlayer");

  const dhakEmpty =
    $("dhakEmpty");


  if (dhak && dhakPlayer) {

    dhakPlayer.src =
      dhak.url;

    if (dhakEmpty) {

      dhakEmpty.style.display =
        "none";

    }

  } else if (dhakEmpty) {

    dhakEmpty.style.display =
      "block";

  }

}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHtml(s) {

  return String(s).replace(
    /[&<>"']/g,
    c =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[c])
  );

}


/* =====================================================
   ONLINE PRESENCE
   ===================================================== */

async function startPresence() {

  if (!sb) return;


  const channel =
    sb.channel(
      "puja-online",
      {
        config: {
          presence: {
            key:
              crypto.randomUUID()
          }
        }
      }
    );


  const update = () => {

    const onlineCount =
      $("onlineCount");

    if (!onlineCount) return;


    onlineCount.textContent =
      `${
        Object.values(
          channel.presenceState()
        )
        .flat()
        .length
      } জন`;

  };


  channel.on(
    "presence",
    {
      event: "sync"
    },
    update
  );


  await channel.subscribe(
    async status => {

      if (
        status ===
        "SUBSCRIBED"
      ) {

        await channel.track({
          online_at:
            new Date()
              .toISOString()
        });

        update();

      }

    }
  );

}


/* =====================================================
   START SUPABASE FEATURES
   ===================================================== */

if (sb) {

  loadPoll();
  loadMedia();
  startPresence();

} else {

  renderPoll([]);

  const onlineCount =
    $("onlineCount");

  if (onlineCount) {

    onlineCount.textContent =
      "Setup বাকি";

  }

}
