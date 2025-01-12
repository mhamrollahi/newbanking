function setErrorMessage(inputElement,message){
  
  let errorMessage = document.createElement('span')
  errorMessage.className = 'errMessage'

  inputElement.parentNode.insertBefore(errorMessage,inputElement.nextSibling)

}

function validationForm(form) {

  const errorMessages = form.querySelectorAll('.errMessage')
  errorMessages.forEach(msg => msg.remove())

  let isValid = true

  Array.from(form.elements).forEach(input => {
    const value = input.value.trim()

    
  })

}