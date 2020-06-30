import $ from 'jquery';

import store from '@/js/store';
import template from '@/templates/SigninEmail.template.html';

import SigninCode from '@/js/components/SigninCode';

const render = async () => {
  const component = $(template);
  
  component.find('form').submit(async function (e) {
    e.preventDefault();
    const email = $(this).find('input[name="email"]').val();

    try {
      await store.actions.signinEmail(email);
      SigninCode.render(email);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message == 'Incorrect email') {
        alert('Неверный Email');
      }
      
      render();
    }
  });
  
  $('main').html(component);
};

export default {
  render
};