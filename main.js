 const list = document.querySelector('ul');
 const form = document.querySelector('form');

 const addNote = (recipe, id) => {
    let time = recipe.created_at.toDate();
     let html = `
     <li data-id="${id}">
     <div>${recipe.title}</div>
     <div>${recipe.body}</div>
     <div>${recipe.important}</div>
     <div>${time}</div>
     <button class="btn btn-danger btn-sm my-2">delete</button>
     </li>`;
    

        list.innerHTML += html;
    
    }


    const deleteNote = (id) => {
        const notes = document.querySelectorAll('li');
        notes.forEach(note => {
            if(note.getAttribute('data-id') === id){
                note.remove();
            }
        });
    }

//Get Documents
db.collection('NoteApp').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        if(change.type === 'added'){
            addNote(doc.data(), doc.id);
        } else if(change.type === 'removed'){
            deleteNote(doc.id);

        }
    });
});

//Add documents
form.addEventListener('submit', e => {
    e.preventDefault();

    const now = new Date();
    const recipe = {
        title: form.recipe.value,
        body: form.body.value,
        important: form.important.value,
        created_at: firebase.firestore.Timestamp.fromDate(now)

    };

    
    db.collection('NoteApp').add(recipe).then(() => {
        console.log('Note added');
    }).catch(err => {
        console.log(err);
    })

});

//Deleting documents
list.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON'){
        const id  = e.target.parentElement.getAttribute('data-id');
        console.log(id);
        db.collection('NoteApp').doc(id).delete().then(() => {
            console.log('Note deleted');
        });
    }
});