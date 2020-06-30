import $ from 'jquery';

import store from '@/js/store';
import Modal from '@/js/components/Modal';
import SigninEmail from '@/js/components/SigninEmail';
import Archives from '@/js/components/Archives';
import Manager from '@/js/components/Manager';
import Editor from '@/js/components/Editor';

const processing = $('#processing'); 

const init = () => {
  $('#saveButton').click(async () => {
    if (!store.getters.getArchive()) return;
    
    try {
      await store.actions.uploadArchive();
    } catch (e) {
      alert('При сохранении архива возникла ошибка');
    }
  });
  
  $('#duplicateButton').click(() => {
    if (!store.getters.getArchive()) return;
    
    const modal = new Modal({
      title: 'Сохранить как новый архив (дублировать).',
      name: 'Название версии',
      key: 'Ключ шифрования',
      submit: {
        label: 'Сохранить',
        color: 'btn-primary'
      }
    });

    modal.submit(async result => {
      modal.hide();
      
      try {
        await store.actions.forkArchive(result.name, result.key);
      } catch (e) {
        alert('Ошибка! Не удалось сохранить (дублировать) архив');
      } finally {
        switch (store.getters.getChild().type) {
          case 'directory':
            Manager.render();
            break;
            
          case 'file':
            Editor.render();
            break;
        }
      }
    });
  });
  
  $('#backButton').click(() => {
    if (!store.getters.getPath()) return;
    
    if (store.getters.getPath().length) {
      store.mutations.popPath();
      Manager.render();
    } else {
      store.mutations.cleanArchive();
      Archives.render();
    }
  });
  
  $('#signouthButton').click(async () => {
    await store.actions.signout();
    SigninEmail.render();
  });
};

export default {
  init,
  processing
};