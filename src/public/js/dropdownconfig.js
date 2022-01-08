document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dropdownconfig table .action-buttons .button.delete').forEach(elem => {
        elem.addEventListener('click', e=>{
            deleteDropdownItem(elem.getAttribute('item-id'), elem.getAttribute('dropdown-name'));
        })
    })
    document.querySelectorAll('.dropdownconfig table .action-buttons .button.edit').forEach(elem => {
        elem.addEventListener('click', e=>{
            updateDropdownItem(elem.getAttribute('item-id'), elem.getAttribute('dropdown-name'))
        })
    })

    function deleteDropdownItem(id, dropdownName){
        // fetch(`/dropdown/${id}`, {
        //     method: 'delete'
        //   })
        //     .then(data => {
        //         console.log('data:', data);                
        //     })
        //     .catch((error) => {
        //       console.log('Error:', error);
        //     });
    }

    function updateDropdownItem(id, dropdownName){

    }
})