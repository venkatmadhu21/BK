const axios = require('axios');

async function run(serNo = 3) {
  try {
    const url = `http://localhost:5000/api/family/dynamic-relations/${serNo}`;
    console.log('GET', url);
    const { data } = await axios.get(url);
    console.log(`\nFound ${data.length} relations for serNo ${serNo}:`);
    for (const r of data.slice(0, 30)) {
      const name = [r.related.firstName, r.related.middleName, r.related.lastName].filter(Boolean).join(' ');
      const label = r.relationMarathi ? `${r.relationEnglish} [${r.relationMarathi}]` : r.relationEnglish;
      console.log(`${label} -> ${name} (serNo ${r.related.serNo})`);
    }
    if (data.length > 30) {
      console.log(`...and ${data.length - 30} more`);
    }
  } catch (err) {
    if (err.response) {
      console.error('Error status:', err.response.status, err.response.data);
    } else {
      console.error('Request error:', err.message);
    }
  }
}

const serNo = parseInt(process.argv[2] || '3', 10);
run(serNo);