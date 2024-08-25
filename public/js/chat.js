const username = localStorage.getItem('name');

if (!username) {
  window.location.replace('/');

  throw new Error('Username is required');
}

//Referencias HTMl
const lblStatusOnline = document.querySelector('#status-online')
const lblStatusOffline = document.querySelector('#status-offline')
const userUlElement = document.querySelector('ul');
const form = document.querySelector('form');
const input = document.querySelector('input')
const chatElement = document.querySelector('#chat')

const renderUser = ( users ) => {
    userUlElement.innerHTML = ' ' 

    users.forEach( ( user ) => {
        const liElement = document.createElement( 'li')
        liElement.innerText = user.name;
        userUlElement.appendChild( liElement )
    });
}

const renderMessage = ( payload ) => {
    const { userId, message, name } = payload

    const divElement = document.createElement('div')
    divElement.classList.add('message')

    if( userId !== socket.id) {
        divElement.classList.add('incoming')
    }

    divElement.innerHTML = /*html*/ `
        <small>${ name }</small>
        <p>${ message }</p>
    `
    chatElement.appendChild( divElement )

    //scroll al final de los mensajes
    chatElement.scrollTop = chatElement.scrollHeight
} 



form.addEventListener('submit', ( event ) => {
    event.preventDefault()

    const message = input.value
    input.value = ' '

    socket.emit('send-message', message)
})


const socket = io({
  auth: {
    token: 'ABC-123',
    name: username,
  },
});


socket.on('connect', () => {
    lblStatusOnline.classList.remove('hidden');
    lblStatusOffline.classList.add('hidden')
})

socket.on('disconnect', () => {
    lblStatusOnline.classList.add('hidden');
    lblStatusOffline.classList.remove('hidden')
})

socket.on('welcome-message', (data) => {
    console.log(data, username);
    
})

socket.on('on-clients-changed', renderUser)

socket.on('on-message', renderMessage)