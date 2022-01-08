document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.accordion').forEach(elem => {
        const contentId = elem.getAttribute('contentId');
        if(contentId){
            const content = document.getElementById(contentId);
            elem.querySelector('.content').append(content)
        }
        elem.querySelector('.title').addEventListener('click', e => {
            const content = e.target.parentNode
            content.classList.toggle('show-details');
        });
    })
})
