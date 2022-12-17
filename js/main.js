const $editForm = document.querySelector("#edit-form");
const $addForm = document.querySelector("#add-form");
const $count = document.querySelector(".count");
const $studentTableBody = document.querySelector("#students-table-body");
const $template = document.querySelector("#student-template").content;

const newFragment = new DocumentFragment();

window.onload = async () => {
  renderElements(await fetchData())
}

$addForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  createData();
  $addForm.reset();
})

async function fetchData() {
  try {
    const response = await fetch("http://167.235.158.238/students")
    const body = await response.json()
    return body;
  } catch (error) {
    console.log(error.message);
  }
}

async function deleteData(id) {
  try {
    await fetch(`http://167.235.158.238/students${id}`, {
      method: 'DELETE',
    });
    renderElements(await fetchData())
  } catch (error) {
    console.log(error.message);
  }
}

async function createData(data) {
  try {
    const $name = document.getElementById("name");
    const $mark = document.getElementById("mark");
    const response = await fetch("http://167.235.158.238/students", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        name: $name.value,
        markData: new Date(),
        mark: $mark.value,
      })
    })
    const data = await response.json();
    renderElements(await fetchData());
  } catch (error) {
    console.log(error.message);
  }
}

async function updateData(id) {
  try {
    const $editName = document.getElementById("edit-name");
    const $editMark = document.getElementById("edit-mark");
    const response = await fetch(`http://167.235.158.238/students${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        name: $editName.value,
        markData: new Date(),
        mark: $editMark.value,
      })
    })
    const data = await response.json();
    renderElements(await fetchData());
    console.log(data);
  } catch (error) {
    console.log(error.message);
  }
}

async function renderElements(data) {
  $studentTableBody.innerHTML = "";
  $count.textContent = `Count: ${data.length}`;
  data.forEach(element => {
    const templateClone = $template.cloneNode(true);

    templateClone.querySelector(".student-id").textContent = element.id;
    templateClone.querySelector(".student-name").textContent = element.name;
    // templateClone.querySelector(".student-marked-date").textContent = element.markData.slice(0, 10);
    templateClone.querySelector(".student-mark").textContent = element.mark;
    templateClone.querySelector(".student-edit").dataset.id = element.id;
    templateClone.querySelector(".student-delete").dataset.id = element.id;
    const $studentPasStatus = templateClone.querySelector(".student-pass-status");

    if (element.mark >= 100) {
      $studentPasStatus.textContent = "Pass";
      $studentPasStatus.classList.add("bg-success");
    } else {
      $studentPasStatus.textContent = "Failed";
      $studentPasStatus.classList.add("bg-danger");
    }
    newFragment.appendChild(templateClone);
  });

  $studentTableBody.appendChild(newFragment);
}

$studentTableBody.addEventListener("click", evt => {
  if (evt.target.matches("#student-delete")) {
    const btnId = evt.target.dataset.id;
    deleteData(btnId);
  }

  if (evt.target.matches("#student-edit")) {
    const btnEditId = evt.target.dataset.id;
    $editForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      updateData(btnEditId);
      $editForm.reset()
    })
  }
})