import $ from 'jquery';

import store from '@/js/store';
import Modal from '@/js/components/Modal';
import Manager from '@/js/components/Manager';
import template from '@/templates/Archives.template.html';

const render = async () => {
  const component = $(template);
  const archives = await store.actions.fetchArchives();
  
  component.find('table tr').click(() => create());
  
  archives.reverse().forEach(item => {
    const tr = $(`<tr class="bg-white rounded shadow-sm"></tr>`);
    
    tr.append(`
      <th class="text-center pl-4">
        <i class="far fa-file-archive text-info h2 mb-0"></i>
      </th>        
    `);
    tr.append(
      $(`
        <td class="pt-5 pb-5 h3 mb-0 w-100">
          ${item.name}
          <br>
          <span class="h6 mb-0">
            <b>Последнее изменение:</b> ${new Date(item.lastModified).toLocaleString('ru', dateOptions)}
          </span>
        </td>       
      `).click(() => open(item._id))
    );
    tr.append(
      $(`
        <td>
          <i class="far fa-edit text-warning h3 mb-0"></i>
        </td>      
      `).click(() => rename(item._id, item.name))
    );
    tr.append(
      $(`
        <td>
          <i class="far fa-trash-alt text-danger h3 mb-0"></i>
        </td>     
      `).click(() => deleteOne(item._id, item.name))
    );
    
    component.find('table tbody').prepend(tr);
  });
  
  $('main').html(component);
};

const open = async id => {
  const modal = new Modal({
    title: 'Открыть архив.',
    key: 'Ключ шифрования',
    submit: {
      label: 'Открыть',
      color: 'btn-success'
    }
  });

  modal.submit(async result => {
    modal.hide();
    
    try {
      await store.actions.fetchArchive(id, result.key);
    } catch (e) {
      return open(id);
    }
    
    Manager.render();
  });
};

const create = () => {
  const modal = new Modal({
    title: 'Создать новый архив.',
    name: 'Название версии',
    key: 'Ключ шифрования',
    submit: {
      label: 'Создать',
      color: 'btn-primary'
    }
  });

  modal.submit(async result => {
    modal.hide();
    
    try {
      await store.actions.createArchive(result.name, result.key);
    } catch (e) {
      alert('Ошибка! Не удалось создать архив');
    } finally {
      render();
    }
  });
};

const rename = (id, name) => {
  const modal = new Modal({
    title: 'Переименовать архив.',
    name,
    submit: {
      label: 'Переименовать',
      color: 'btn-warning'
    }
  });

  modal.submit(async result => {
    modal.hide();
    
    try {
      await store.actions.renameArchive(id, result.name);
    } catch (e) {
      alert('Ошибка! Не удалось переименовать архив');
    } finally {
      render();
    }
  });
};

const deleteOne = (id, name) => {
  const modal = new Modal({
    title: 'Удалить архив.',
    remove: name,
    submit: {
      label: 'Удалить',
      color: 'btn-danger'
    }
  });

  modal.submit(async () => {
    modal.hide();
    
    try {
      await store.actions.deleteArchive(id);
    } catch (e) {
      alert('Ошибка! Не удалось переименовать архив');
    } finally {
      render();
    }
  });
};

const dateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
  timezone: 'UTC',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
};

export default {
  render
};