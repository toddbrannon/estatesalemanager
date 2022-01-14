document.addEventListener('DOMContentLoaded', () => {
    //delete
    document.querySelectorAll('.dropdownconfig table .action-buttons .button.delete').forEach(elem => {
        elem.addEventListener('click', e => {//db, dbvalue, dbname
            const dropdownconfig = document.getElementById(elem.getAttribute('db'))
            showDeleteDropdownItem(
                dropdownconfig.getAttribute('name'),
                dropdownconfig.getAttribute('db'),
                dropdownconfig.getAttribute('dbvalue'),
                dropdownconfig.getAttribute('dbname'),
                elem.getAttribute('item-id'),
                elem.getAttribute('item-name'));
        })
    })
    //edit
    document.querySelectorAll('.dropdownconfig table .action-buttons .button.edit').forEach(elem => {
        elem.addEventListener('click', e => {
            const dropdownconfig = document.getElementById(elem.getAttribute('db'))
            showEditDropdownItem(
                dropdownconfig.getAttribute('name'),
                dropdownconfig.getAttribute('db'),
                dropdownconfig.getAttribute('dbvalue'),
                dropdownconfig.getAttribute('dbname'), 
                elem.getAttribute('item-id'), 
                elem.getAttribute('item-name')
                )
        })
    })
    //add
    document.querySelectorAll('.dropdownconfig .button.add').forEach(elem => {
        const dropdownconfig = document.getElementById(elem.getAttribute('db'))
        elem.addEventListener('click', e => {
            showAddDropdownItem(
                dropdownconfig.getAttribute('name'),
                dropdownconfig.getAttribute('db'),
                dropdownconfig.getAttribute('dbvalue'),
                dropdownconfig.getAttribute('dbname') 
            )
        })
    })
    document.querySelector('#dropdownconfig-modal-cancel').addEventListener('click', e => {
        $('#dropdownconfig-modal').modal('hide')
    })
    document.querySelector('#dropdownconfig-modal-ok').addEventListener('click', e => { 
        const parent = document.getElementById(e.target.getAttribute('db'));

        switch (e.target.getAttribute('action')) {
            case 'add': addDropdownItem(parent.getAttribute('db'), parent.getAttribute('dbvalue'), parent.getAttribute('dbname'),
                document.querySelector('#dropdownItemId').value, document.querySelector('#dropdownItemName').value); break;
            case 'delete': deleteDropdownItem(parent.getAttribute('db'), parent.getAttribute('dbvalue'), e.target.getAttribute('id')); break;
            case 'edit': editDropdownItem(parent.getAttribute('db'), parent.getAttribute('dbvalue'), parent.getAttribute('dbname'),
            document.querySelector('#dropdownItemId').value, document.querySelector('#dropdownItemName').value); break;
        }
    })

    function showAddDropdownItem(name, db, dbvalue, dbname) {
        document.querySelector('label[for="dropdownItemId"]').innerText= name;
        document.querySelector('label[for="dropdownItemName"]').innerText= name;
        document.querySelector('#dropdownItemName').value= '';
        document.querySelector('#dropdownItemId').value= '';
        document.querySelector('#dropdownItemName').value= '';
        document.querySelector('#dropdownItemId').parentElement.style.display = 'none';
        document.querySelector('#dropdownItemName').parentElement.style.display = 'block';
        document.querySelector('#dropdownItemId').disabled = false;

        document.querySelector('#dropdownconfig-modal-title').innerText = `Add ${name}`;
        document.querySelector('#dropdownconfig-modal-ok').setAttribute('action', 'add');
        document.querySelector('#dropdownconfig-modal-ok').setAttribute('db', db);
        document.querySelector('#dropdownconfig-modal-ok').setAttribute('dbvalue', dbvalue);
        document.querySelector('#dropdownconfig-modal-ok').setAttribute('dbname', dbname);
        $('#dropdownconfig-modal').modal('show');
    }

    function showDeleteDropdownItem(name, db, dbvalue, dbname, value, s) {
        document.querySelector('#dropdownItemId').value= '';
        document.querySelector('#dropdownItemName').value= '';
        document.querySelector('#dropdownItemId').parentElement.style.display = 'none';
        document.querySelector('#dropdownItemName').parentElement.style.display = 'none';

        document.querySelector('#dropdownconfig-modal-title').innerText = `Delete ${name}: ${s}?`;
        document.querySelector('#dropdownconfig-modal-ok').setAttribute('action', 'delete');
        document.querySelector('#dropdownconfig-modal-ok').setAttribute('db', db);
        document.querySelector('#dropdownconfig-modal-ok').setAttribute('dbvalue', dbvalue);
        document.querySelector('#dropdownconfig-modal-ok').setAttribute('dbname', dbname);
        document.querySelector('#dropdownconfig-modal-ok').setAttribute('id', value);
        $('#dropdownconfig-modal').modal('show');
    }

    function showEditDropdownItem(name, db, dbvalue, dbname, value, s) {
        document.querySelector('label[for="dropdownItemName"]').innerText= name;
        document.querySelector('#dropdownItemId').value= value;
        document.querySelector('#dropdownItemName').value= s;
        document.querySelector('#dropdownItemId').parentElement.style.display = 'none';
        document.querySelector('#dropdownItemName').parentElement.style.display = 'block';
        document.querySelector('#dropdownItemId').disabled = true;

        document.querySelector('#dropdownconfig-modal-title').innerText = `Edit ${name}`;
        document.querySelector('#dropdownconfig-modal-ok').setAttribute('action', 'edit');
        document.querySelector('#dropdownconfig-modal-ok').setAttribute('db', db);
        document.querySelector('#dropdownconfig-modal-ok').setAttribute('dbvalue', dbvalue);
        document.querySelector('#dropdownconfig-modal-ok').setAttribute('dbname', dbname);

        $('#dropdownconfig-modal').modal('show');
    }

    function addDropdownItem(db, dbvalue, dbname, value, name) {
        fetch(`/dropdown`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ db, dbvalue, dbname, name })
        })
            .then(data => {
                if(data.ok){
                    //$('#dropdownconfig-modal').modal('hide');
                    window.location.href = "/admin";
                }
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    }

    function editDropdownItem(db, dbvalue, dbname, value, name) {
        fetch(`/dropdown`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ db, dbvalue, dbname, value, name })
        })
            .then(data => {
                if(data.ok){
                    //$('#dropdownconfig-modal').modal('hide');
                    window.location.href = "/admin";
                }
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    }

    function deleteDropdownItem(db, dbvalue, value) {
        fetch(`/dropdown/${db}/${dbvalue}/${value}`, {
            method: 'delete'
        })
            .then(data => {
                if(data.ok){
                    //$('#dropdownconfig-modal').modal('hide');
                    window.location.href = "/admin";
                }
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    }
})