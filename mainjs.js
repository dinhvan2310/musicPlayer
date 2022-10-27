// Tabs handlers
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const tabs = $$('.tab-item');
const pages = $$('.page-content');
const line = $('.line');

tabs.forEach( (tab, index) => {
  const page = pages[index];

  tab.onclick = function() {
    $('.tab-item.active').classList.remove('active');
    $('.page-content.active').classList.remove('active');

    line.style.left = this.offsetLeft + 'px';
    line.style.width = this.offsetWidth + 'px';

    this.classList.add('active');
    page.classList.add('active');
  }
});

var messagesApi = 'http://localhost:3000/messages';



// Message handlers



function start() {
  getMessages(renderMessage);
  handleCreateForm();
  
}

start();




function getMessages(callback) {
  fetch(messagesApi)
    .then(function(response) {
      return response.json();
    })
    .then(callback);
}

function renderMessage(messages) {
  
  var htmls = messages.map(function(message) {
    return `<li class="mess-content mess-content-${message.id}">
    
      <h4>
        ${message.name} :
        <div class="edit-message-icon"><i class="fa-sharp fa-solid fa-ellipsis-vertical"></i></div>
        
        <ul class="edit-message-content">
          <li onclick="handleEditMessage(${message.id})" >Chỉnh sửa</li>
          <li onclick="deleteCourse(${message.id})">Xóa</li>
        </ul>

      </h4>
      
      <p>${message.message}</p>
      </li>
      `;
  })
  $('ul.mess-box').innerHTML = htmls.join('');


  var editMessIcons = $$('.edit-message-icon');
  var editMessContents = $$('.edit-message-content');
  
  
  
  editMessIcons.forEach(function(editMessIcon, index) {
  editMessIcon.addEventListener('click', function(e) {
    $('div.layer').style.display = 'block';
    editMessContents[index].classList.add('active');
  });

  $('div.layer').onclick = function(e){
    $('.edit-message-content.active').classList.remove('active');
    e.target.style.display = 'none';
    $('.edit-mess').classList.remove('active');
  }
  
  })

}

function deleteCourse(id) {
  $('.layer').style.display = 'none';
  var option = {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      },
  };
  fetch(messagesApi + '/' + id, option)
      .then(function(response){
          response.json();
      })
      .then(function(){
          var courseItem = $('.mess-content.mess-content-'+id);
          if(courseItem) {
              courseItem.remove();
          }
      })
}

function handleCreateForm() {
  var createBtn = document.querySelector('#create');
  createBtn.onclick = function() {
      var name = document.querySelector('input[name="name"]').value;
      var description = document.querySelector('input[name="description"]').value;
      
      var formData = {
          name: name,
          message: description
      }
      document.querySelector('input[name="name"]').value = '';
      document.querySelector('input[name="description"]').value = '';
      createCourse(formData, function(){
          getMessages(renderMessage);
      });
      
  }
}

function createCourse(data, callback) {
  var option = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  };
  fetch(messagesApi, option)
      .then(function(response){
          response.json();
      })
      .then(callback)
}

function handleEditMessage (id) {
  $('.edit-mess').classList.add('active');
  $('div.layer').style.display = 'block';

  var nameMessEdit = $('input[name=name-edit]').target.value;
  var descriptionMessEdit = $('input[name=description-edit]').target.value;

  $('input[name=name-edit]').target.value = '';
  $('input[name=description-edit]').target.value = '';

  var data = {
    name: nameMessEdit,
    message: descriptionMessEdit
  };

  var option = {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
};

fetch(messagesApi + '/' + id)
  .then(function(response){
    return response.json();
  })
  


}