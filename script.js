const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

let notes = JSON.parse(localStorage.getItem("quickNotes")) || [];

function saveNotes() {
    localStorage.setItem("quickNotes", JSON.stringify(notes));
}

function render() {
    notesList.textContent = "";

    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }

    const searchText = searchInput.value.toLowerCase();

    const filteredNotes = notes.filter(function(note) {
        return note.text.toLowerCase().includes(searchText);
    });

    if (filteredNotes.length === 0 && searchText !== "") {
        const message = document.createElement("li");
        message.textContent = "No notes match your search.";
        notesList.appendChild(message);
        return;
    }

    filteredNotes.forEach(function(note) {
        const listItem = document.createElement("li");
        listItem.classList.add("note-card");

        if (note.category === "Personal") {
            listItem.classList.add("category-personal");
        } else if (note.category === "Work") {
            listItem.classList.add("category-work");
        } else if (note.category === "Study") {
            listItem.classList.add("category-study");
        }

        const noteText = document.createElement("p");
        noteText.textContent = note.text;

        const categoryLabel = document.createElement("p");
        categoryLabel.textContent = note.category;
        categoryLabel.classList.add("note-category");

        const noteDate = document.createElement("p");
        noteDate.textContent = note.createdAt;
        noteDate.classList.add("note-date");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function() {
            notes = notes.filter(function(item) {
                return item.id !== note.id;
            });

            saveNotes();
            render();
        });

        listItem.appendChild(noteText);
        listItem.appendChild(categoryLabel);
        listItem.appendChild(noteDate);
        listItem.appendChild(deleteButton);

        notesList.appendChild(listItem);
    });
}

noteForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        return;
    }

    const note = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(note);
    saveNotes();

    errorMessage.textContent = "";
    noteInput.value = "";

    render();
});

searchInput.addEventListener("input", function() {
    render();
});

render();