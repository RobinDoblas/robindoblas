/* Botón de menú del navegador que activa la lista */
function navlist() { 
    const navList = document.querySelector('.nav-list');
    const cross = document.querySelector('.cross');
    const logo = document.querySelector('.logo-container');
    const body = document.body;
    navList.classList.toggle('active');
    cross.classList.toggle('active');
    logo.classList.toggle('active');
    body.classList.toggle('no-scroll');
}


/* Hace que los enlaces de redes sociales se abran en una nueva ventana */
document.querySelectorAll('.social-media li a').forEach(link => {
    link.setAttribute('target', '_blank');
  });
