document.addEventListener('DOMContentLoaded', () => {
    addEventListenersModal();
    document.querySelectorAll('.dropdownconfig').forEach(elem => {        
        addEventListenersConfigTable(elem);
        $(`#table-${elem.id}`).on('draw.dt', function () {
            addEventListenersConfigTable(elem);
        });
    })

    function addEventListenersConfigTable(t) {
        //delete
        t.querySelectorAll('.button.delete').forEach(elem => {
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
        t.querySelectorAll('.button.edit').forEach(elem => {
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
        t.querySelectorAll('.button.add').forEach(elem => {
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
    }

    function addEventListenersModal() {
        document.querySelector(`#dropdownconfig-modal-cancel`).addEventListener('click', e => {
            $(`#dropdownconfig-modal`).modal('hide')
        })

        document.querySelector(`#dropdownconfig-modal-ok`).addEventListener('click', e => {
            const parent = document.getElementById(e.target.getAttribute('db'));

            switch (e.target.getAttribute('action')) {
                case 'add': addDropdownItem(parent.getAttribute('db'), parent.getAttribute('dbvalue'), parent.getAttribute('dbname'),
                    document.querySelector(`#dropdownItemName`).value); break;
                case 'delete': deleteDropdownItem(parent.getAttribute('db'), parent.getAttribute('dbvalue'), e.target.getAttribute('value')); break;
                case 'edit': editDropdownItem(parent.getAttribute('db'), parent.getAttribute('dbvalue'), parent.getAttribute('dbname'),
                    e.target.getAttribute('value'), document.querySelector(`#dropdownItemName`).value); break;
            }
        })
    }

    function initModal(title, name, isIdVisible, isNameVisible, action, db, dbvalue, dbname, value) {
        document.querySelector(`label[for="dropdownItemName"]`).innerText = name;
        const nameElem = document.querySelector(`#dropdownItemName`);
        nameElem.value = '';
        nameElem.parentElement.style.display = isNameVisible ? 'block' : 'none';

        document.querySelector(`#dropdownconfig-modal-title`).innerText = title;
        const btnOk = document.querySelector('#dropdownconfig-modal-ok')
        btnOk.setAttribute('action', action);
        btnOk.setAttribute('db', db);
        btnOk.setAttribute('dbvalue', dbvalue);
        btnOk.setAttribute('dbname', dbname);
        btnOk.setAttribute('value', value);
    }

    function showAddDropdownItem(name, db, dbvalue, dbname) {
        initModal(`Add ${name}`, name, false, true, 'add', db, dbvalue, dbname, '');

        $(`#dropdownconfig-modal`).modal('show');
    }

    function showDeleteDropdownItem(name, db, dbvalue, dbname, value, s) {
        initModal(`Delete ${name}: ${s}?`, name, false, false, 'delete', db, dbvalue, dbname, value);

        $(`#dropdownconfig-modal`).modal('show');
    }

    function showEditDropdownItem(name, db, dbvalue, dbname, value, s) {
        initModal(`Edit ${name}`, name, false, true, 'edit', db, dbvalue, dbname, value);

        document.querySelector(`#dropdownItemName`).value = s;

        $(`#dropdownconfig-modal`).modal('show');
    }

    function addDropdownItem(db, dbvalue, dbname, name) {
        fetch(`/dropdown`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ db, dbvalue, dbname, name })
        })
            .then(data => {
                if (data.ok) {
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
                if (data.ok) {
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
                if (data.ok) {
                    //$('#dropdownconfig-modal').modal('hide');
                    window.location.href = "/admin";
                }
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    }
})