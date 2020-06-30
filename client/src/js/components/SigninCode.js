import $ from 'jquery';

import store from '@/js/store';
import template from '@/templates/SigninCode.template.html';

import SigninEmail from '@/js/components/SigninEmail';
import Archives from '@/js/components/Archives';

const render = async email => {
  const component = $(template);
  
  component.find('form').prepend(
    $(`
      <h6 class="cursor-pointer text-muted text-center mb-3"><u>Отправить новый код</u></h6>  
    `)
      .click(async () => {
        await store.actions.signinEmail(email);
        alert(`Новый код был отправлен на электронную почту ${email}`);
        render(email);
      })
  );
  
  component.find('form').prepend(`
    <h6 class="text-muted text-center mb-3">
      На электронный адрес
      <br>
      <span class="font-weight-bold">${email}</span>
      <br>
      был отправлен одноразовый код.
    </h6>
  `);
  
  component.find('form').submit(async function (event) {
    event.preventDefault();
    const code = $(this).find('input[name="code"]').val();
    
    try {
      await store.actions.signinCode(email, code);
      Archives.render();
    } catch (err) {
      const message = err.response && err.response.data && err.response.data.message;
      
      switch (message) {
        case 'Authentication code not sent':
          alert('Код не был отправлен');
          SigninEmail.render();
          break;
          
        case 'Invalid authentication code':
          alert('Введен неверный код');
          render(email);
          break;  
          
        case 'Expired authentication code':
          alert('Код просрочен');
          SigninEmail.render();
          break;    
      }
      
    }    
  });
  
  $('main').html(component);
};


export default {
  render
};