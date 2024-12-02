const NUM_CATEGORIES = 6; // Number of categories to fetch

async function getCategoryIds() {
  const res = await fetch("https://jservice.io/api/categories?count=100");
  const categories = await res.json();

  // Shuffle and pick NUM_CATEGORIES random ids
  let randomCategories = categories
    .sort(() => 0.5 - Math.random())
    .slice(0, NUM_CATEGORIES);
  
  return randomCategories.map(cat => cat.id);
}

async function getCategory(catId) {
    const res = await fetch(`https://jservice.io/api/category?id=${catId}`);
    const category = await res.json();
  
    const clues = category.clues.map(clue => ({
      question: clue.question,
      answer: clue.answer,
      showing: null
    }));
  
    return {
      title: category.title,
      clues: clues.slice(0, NUM_QUESTIONS_PER_CAT)
    };
  }

  const NUM_QUESTIONS_PER_CAT = 5;

  async function fillTable() {
    const thead = document.querySelector("#jeopardy thead");
    const tbody = document.querySelector("#jeopardy tbody");
  
    thead.innerHTML = "";
    tbody.innerHTML = "";
  
    // Create table header row
    const headerRow = document.createElement("tr");
    for (let category of categories) {
      const th = document.createElement("th");
      th.innerText = category.title;
      headerRow.append(th);
    }
    thead.append(headerRow);
  
    // Create question cells
    for (let i = 0; i < NUM_QUESTIONS_PER_CAT; i++) {
      const tr = document.createElement("tr");
      for (let j = 0; j < categories.length; j++) {
        const td = document.createElement("td");
        td.innerText = "?";
        td.dataset.categoryIndex = j;
        td.dataset.clueIndex = i;
        td.addEventListener("click", handleClick);
        tr.append(td);
      }
      tbody.append(tr);
    }
  }

  function handleClick(evt) {
    const td = evt.target;
    const catIndex = td.dataset.categoryIndex;
    const clueIndex = td.dataset.clueIndex;
  
    const clue = categories[catIndex].clues[clueIndex];
  
    if (clue.showing === null) {
      td.innerText = clue.question;
      clue.showing = "question";
    } else if (clue.showing === "question") {
      td.innerText = clue.answer;
      clue.showing = "answer";
    }
  }
  
  function showLoadingView() {
    document.querySelector("#jeopardy").style.display = "none";
    document.querySelector("#loading-spinner").style.display = "block";
  }
  
  function hideLoadingView() {
    document.querySelector("#loading-spinner").style.display = "none";
    document.querySelector("#jeopardy").style.display = "block";
  }

  async function setupAndStart() {
    showLoadingView();
  
    const categoryIds = await getCategoryIds();
    categories = [];
  
    for (let id of categoryIds) {
      categories.push(await getCategory(id));
    }
  
    await fillTable();
    hideLoadingView();
  }

  document.querySelector("#start-button").addEventListener("click", setupAndStart);

  window.onload = function() {
    setupAndStart();
  }