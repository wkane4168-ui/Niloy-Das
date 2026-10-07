/* =====================================================
   app.js
   Puja Website — Countdown + Clothing Poll
   ===================================================== */


/* ================= COUNTDOWN ================= */

function startCountdown(targetDate, elements) {

  function updateCountdown() {

    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const distance = target - now;

    if (distance <= 0) {
      document.getElementById(elements.days).textContent = "00";
      document.getElementById(elements.hours).textContent = "00";
      document.getElementById(elements.minutes).textContent = "00";
      document.getElementById(elements.seconds).textContent = "00";
      return;
    }

    const days = Math.floor(
      distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (distance / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
      (distance / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
      (distance / 1000) % 60
    );

    document.getElementById(elements.days).textContent =
      String(days).padStart(2, "0");

    document.getElementById(elements.hours).textContent =
      String(hours).padStart(2, "0");

    document.getElementById(elements.minutes).textContent =
      String(minutes).padStart(2, "0");

    document.getElementById(elements.seconds).textContent =
      String(seconds).padStart(2, "0");
  }

  updateCountdown();

  setInterval(updateCountdown, 1000);
}


/* ================= MAHALAYA ================= */

startCountdown(
  "2026-10-10T00:00:00+06:00",
  {
    days: "mahalaya-days",
    hours: "mahalaya-hours",
    minutes: "mahalaya-minutes",
    seconds: "mahalaya-seconds"
  }
);


/* ================= PUJA ================= */

startCountdown(
  "2026-10-16T00:00:00+06:00",
  {
    days: "puja-days",
    hours: "puja-hours",
    minutes: "puja-minutes",
    seconds: "puja-seconds"
  }
);


/* ================= CLOTHING POLL ================= */

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


const defaultVotes = {
  tshirt: 0,
  ganji: 0,
  shirt: 0,
  jeans: 0
};


let votes;

try {

  votes =
    JSON.parse(
      localStorage.getItem(
        "puja_clothing_votes"
      )
    ) || { ...defaultVotes };

} catch (error) {

  votes = { ...defaultVotes };

}


/* ================= SAVE VOTES ================= */

function saveVotes() {

  localStorage.setItem(
    "puja_clothing_votes",
    JSON.stringify(votes)
  );

}


/* ================= SHOW RESULTS ================= */

function showClothingResults() {

  const resultBox =
    document.getElementById(
      "poll-results"
    );

  if (!resultBox) return;


  const total =
    Object.values(votes).reduce(
      (sum, value) => sum + value,
      0
    );


  if (total === 0) {

    resultBox.innerHTML =
      "<p style='text-align:center;color:#777;'>এখনও কোনো ভোট দেওয়া হয়নি।</p>";

    return;
  }


  resultBox.innerHTML =
    clothingOptions.map(option => {

      const percentage =
        Math.round(
          (votes[option.key] / total) * 100
        );


      return `
        <div class="poll-result">

          <div class="poll-result-top">
            <span>${option.name}</span>
            <strong>${percentage}%</strong>
          </div>

          <div class="poll-bar">
            <div
              class="poll-bar-fill"
              style="width:${percentage}%">
            </div>
          </div>

        </div>
      `;

    }).join("");

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


        /*
         * একজন visitor একবারই vote করতে পারবে
         * এই browser-এ।
         */

        if (
          !localStorage.getItem(
            "puja_clothing_voted"
          )
        ) {

          if (
            Object.prototype.hasOwnProperty.call(
              votes,
              selected
            )
          ) {

            votes[selected]++;

            saveVotes();

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


/* ================= INITIAL RESULT ================= */

showClothingResults();
