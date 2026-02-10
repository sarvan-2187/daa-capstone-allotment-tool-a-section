// Node 18+ has global fetch

const BASE_URL =
  "https://bug-free-winner-v6rpjx9g4pr7hxrgj-3000.app.github.dev";

async function allocateStudent(roll) {
  try {
    const res = await fetch(`${BASE_URL}/api/allocate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roll }),
    });

    let data;

    try {
      data = await res.json();
    } catch {
      throw new Error(`Invalid JSON response (Status ${res.status})`);
    }

    if (!res.ok) {
      console.log(`❌ ${roll} -> ${data.error}`);
      return false;
    }

    console.log(`✅ ${roll} -> Problem ${data.problemNumber}`);
    return true;

  } catch (err) {
    console.error(`🔥 ${roll} -> ${err.message}`);
    return false;
  }
}

async function run() {
  console.log("🚀 Starting bulk allocation test...\n");

  const rolls = [];

  for (let i = 1; i <= 60; i++) {
    const padded = String(i).padStart(2, "0");
    rolls.push(`CH.SC.U4CSE240${padded}`);
  }

  const results = await Promise.all(rolls.map(allocateStudent));

  const successCount = results.filter(Boolean).length;
  const failCount = results.length - successCount;

  console.log("\n🎯 Bulk allocation completed.");
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed : ${failCount}`);
}

run();
