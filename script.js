const text = document.getElementById("text")
const category = document.getElementById("category")
const priority = document.getElementById("priority")
const dueDate = document.getElementById("dueDate")
const add = document.getElementById("add")
const space = document.getElementById("space")

const total = document.getElementById("total")
const completed = document.getElementById("completed")
const rate = document.getElementById("rate")
const clearAll = document.getElementById("clearAll")
const filterCompleted = document.getElementById("filterCompleted")
const themeToggle = document.getElementById("themeToggle")

let data = JSON.parse(localStorage.getItem("blum")) || []
let showCompletedOnly = false

const save = () => localStorage.setItem("blum", JSON.stringify(data))

const render = () => {
  space.innerHTML = ""
  const view = showCompletedOnly ? data.filter(i=>i.done) : data

  view.forEach(i => {
    const card = document.createElement("div")
    card.className = "card" + (i.done ? " done" : "")
    card.dataset.id = i.id

    card.innerHTML = `
      <div>
        <strong>${i.text}</strong>
        <span class="tag priority-${i.priority}">${i.priority}</span>
        <span class="tag">${i.category}</span>
        ${i.due ? `<br><small>Due: ${i.due}</small>` : ""}
      </div>
      <div class="actions">
        <button data-a="toggle">✔</button>
        <button data-a="remove">✖</button>
      </div>
    `
    space.appendChild(card)
  })

  const done = data.filter(i=>i.done).length
  total.textContent = data.length
  completed.textContent = done
  rate.textContent = data.length ? Math.round(done/data.length*100) + "%" : "0%"
}

add.onclick = () => {
  if(!text.value.trim()) return
  data.push({
    id: Date.now(),
    text: text.value,
    category: category.value,
    priority: priority.value,
    due: dueDate.value,
    done: false
  })
  text.value = ""
  dueDate.value = ""
  save()
  render()
}

space.onclick = e => {
  const a = e.target.dataset.a
  if(!a) return
  const id = e.target.closest(".card").dataset.id
  const item = data.find(i=>i.id==id)
  if(a==="toggle") item.done = !item.done
  if(a==="remove") data = data.filter(i=>i.id!=id)
  save()
  render()
}

filterCompleted.onclick = () => {
  showCompletedOnly = !showCompletedOnly
  filterCompleted.classList.toggle("active")
  render()
}

clearAll.onclick = () => {
  if(!data.length) return
  if(confirm("Reset your entire space?")) {
    data = []
    save()
    render()
  }
}

themeToggle.onclick = () => {
  document.body.classList.toggle("dark")
}

render()
