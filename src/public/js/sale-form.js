const form = document.getElementById('inputForm');
const cards = form.getElementsByClassName('card-body');
const submit = document.getElementById('saveBtn');

let isNew;
let saleId;
let currentCard;

const setupEditSale = (id, cardIndex, isAllValidated) => {
  submit.innerHTML = 'Save Changes';
  for (const card of cards) {
    card.classList.add('was-validated');
    card.style.display = isAllValidated || parseInt(card.id.replace('card-', '')) - 1 <= cardIndex ? 'block' : 'none'
  }
  isNew = false;
  saleId = id;

  currentCard = cardIndex;

  setupSaveButton();
  setupDeleteButton();
  document.getElementById("invoiceBtn").style.display = isAllValidated ? 'block' : 'none';
}

const setupNewSale = () => {
  for (let i = 1; i <= 3; i++) {
    cards[i].style.display = 'none';
  }
  isNew = true;
  currentCard = 0;
  setupSaveButton();
}

const setupSaveButton = () => {
  submit.addEventListener('click', e => {
    e.preventDefault();

    document.getElementById("deleteErrorMessage").innerText = ''

    if (isNew) {
      cards[currentCard].classList.add('was-validated');
    }

    for (let i = 0; i <= currentCard; i++) {
      if (cards[i].querySelectorAll(':invalid').length) {
        alert('Invalid fields found.');
        return;
      }
    }

    const form = document.getElementById('inputForm');
    const data = new URLSearchParams(new FormData(form));
    let url = '/sale';
    if (saleId) {
      url += '/' + saleId;
    }
    fetch(url, {
      method: 'post',
      body: data,
    })
      .then(response => response.json())
      .then(data => {
        saleId = data.id;
        currentCard++;

        window.location.href = "/sales";
      })
      .catch((error) => {
        console.log('Error:', error);
      });
    return false;
  });
}

const setupDeleteButton = () => {
  const btn = document.getElementById("deleteBtn")
  btn.style.display = 'block';
  btn.addEventListener('click', e => {
    $('#deleteModal').modal('show')
  })

  document.getElementById("deleteModalCancel").addEventListener('click', e => {
    $('#deleteModal').modal('hide')
  })

  document.getElementById("deleteModalConfirm").addEventListener('click', e => {
    $('#deleteModal').modal('hide')

    if (!saleId) {
      return
    }
    fetch(`/${saleId}`, {
      method: 'delete'
    })
      .then(data => {
        if(data.status !== 200){
          //error
          document.getElementById("deleteErrorMessage").innerText = data.statusText
        } else {
          window.location.href = "/sales";
        }          
      })
      .catch((error) => {
        console.log('Error:', error);
      });
    return false;
  })

}

export { setupEditSale, setupNewSale }
