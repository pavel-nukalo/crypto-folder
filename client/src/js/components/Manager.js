import $ from 'jquery';

import store from '@/js/store';
import Modal from '@/js/components/Modal';
import Editor from '@/js/components/Editor';
import template from '@/templates/Manager.template.html';

const render = async () => {
  const component = $(template);
  const clipboard = store.getters.getClipboard();
  const child = store.getters.getChild();
  
  component.prepend(`
    <h6 class="mt-4 font-weight-bold mb-0">
      ${store.getters.getBreadcrumbs()}/
    </h6>
  `);
  
  if (clipboard) {
    const tr = $(`<tr class="bg-success rounded shadow-sm"></tr>`);
    
    if (clipboard.type == 'directory') {
      tr.append(`
        <th class="text-center pl-4">
          <i class="fas fa-folder text-white h2 mb-0"></i>
        </th>
      `);
    } else {
      tr.append(`
        <th class="text-center pl-4">
          <i class="fas fa-file-alt text-white h2 mb-0"></i>
        </th>
      `);
    }
    
    tr.append(`
      <td colspan="5" class="text-white pt-3 pb-3 w-100">
        ${clipboard.name}
      </td>
    `); 
    
    tr.append(
      $(`
        <td class="pr-4">
          <i class="fa fa-trash-alt text-white h3 mb-0"></i>
        </td>
      `).click(() => cleanClipboard())
    );   

    component.find('table tbody').append(tr);
  }
  
  child.children.forEach((item, i) => {
    const tr = $(`<tr class="bg-white rounded shadow-sm"></tr>`);
    
    if (item.type == 'directory') {
      tr.append(`
        <th class="text-center pl-4">
          <i class="fas fa-folder text-primary h2 mb-0"></i>
        </th>
      `);
    } else {
      tr.append(`
        <th class="text-center pl-4">
          <i class="fas fa-file-alt text-primary h2 mb-0"></i>
        </th>
      `);
    }
    
    tr.append(
      $(`
        <td class="pt-5 pb-5 h3 mb-0 w-100">
          ${item.name}
          <br>
          <span class="h6 mb-0">
            <b>Последнее изменение:</b> ${new Date(item.lastModified).toLocaleString('ru', dateOptions)}
          </span>
        </td>
      `).click(() => open(i, item.type))
    );
    
    
    tr.append(
      $(`
        <td>
          <i class="far fa-edit text-warning h3 mb-0"></i>
        </td>
      `).click(() => rename(i, item.name))
    );
    
    tr.append(
      $(`
        <td>
          <i class="far fa-copy text-muted h3 mb-0"></i>
        </td>
      `).click(() => copy(i))
    );
    
    tr.append(
      $(`
        <td>
          <i class="far fa-trash-alt text-danger h3 mb-0"></i>
        </td>
      `).click(() => deleteOne(i, item.name))
    );
    
    if (clipboard) {
      tr.append(`
        <td style="cursor: default;">
          <i class="far fa-clipboard text-primary h2 mb-0"></i>
        </td>
      `);
      
      const td = $(`<td class="pr-4"></td>`);
      
      td.append(
        $(`
          <div>
            <i class="fas fa-level-up-alt h6 mb-0 text-primary"></i>
          </div>
        `).click(() => paste(i))
      );
      
      td.append(
        $(`
          <div>
            <i class="fas fa-level-down-alt h6 mb-0 text-primary"></i>
          </div>
        `).click(() => paste(i + 1))
      );
      
      tr.append(td);
    } else {
      tr.append(`
        <td style="cursor: default;">
          <i class="far fa-plus-square text-primary h2 mb-0"></i>
        </td>
      `);
      
      const td = $(`<td class="pr-4"></td>`);
      
      td.append(
        $(`
          <div>
            <i class="fas fa-level-up-alt h6 mb-0 text-primary"></i>
          </div>
        `).click(() => create(i))
      );
      
      td.append(
        $(`
          <div>
            <i class="fas fa-level-down-alt h6 mb-0 text-primary"></i>
          </div>
        `).click(() => create(i + 1))
      );
      
      tr.append(td);
    }
    
    component.find('table tbody').append(tr);
  });
  
  if (!child.children.length) {
    if (clipboard) {
      component.find('table tbody').append(
        $(`
          <tr class="bg-white rounded shadow-sm">
            <th class="text-center pl-4">
              <i class="far fa-clipboard text-primary h2 mb-0"></i>
            </th>
            <td colspan="5" class="pt-3 pb-3 w-100">Вставить скопированный объект</td>
            <td class="pr-4">
              <i class="fas fa-plus text-success h3 mb-0"></i>
            </td>
          </tr>
        `).click(() => paste(0))
      );
    } else {
      component.find('table tbody').append(
        $(`
          <tr class="bg-white rounded shadow-sm">
            <th class="text-center pl-4">
              <i class="fas fa-certificate text-primary h2 mb-0"></i>
            </th>
            <td colspan="5" class="pt-3 pb-3 w-100">Создать новый объект</td>
            <td class="pr-4">
              <i class="fas fa-plus text-success h3 mb-0"></i>
            </td>
          </tr>
        `).click(() => create(0))
      );
    }
  }
  
  $('main').html(component); 
};

const cleanClipboard = () => {
  store.mutations.cleanClipboard();
  render();
};

const open = (i, type) => {
  store.mutations.pushPath(i);
  
  switch (type) {
    case 'directory':
      render();
      break;
      
    case 'file':
      Editor.render();
      break;
  }
};

const rename = (i, name) => {
  const modal = new Modal({
    title: 'Переименовать объект.',
    name,
    submit: {
      label: 'Переименовать',
      color: 'btn-warning'
    }
  });

  modal.submit(result => {
    store.mutations.renameChild(i, result.name);
    modal.hide(() => render());
  });
};

const copy = i => {
  store.mutations.copyChild(i);
  render();
};

const deleteOne = (i, name) => {
  const modal = new Modal({
    title: 'Удалить объект.',
    remove: name,
    submit: {
      label: 'Удалить',
      color: 'btn-danger'
    }
  });

  modal.submit(() => {
    store.mutations.deleteChild(i);
    modal.hide(() => render());
  });
};

const paste = i => {
  store.mutations.pasteChild(i);
  store.mutations.cleanClipboard();
  render();
};

const create = i => {
  const modal = new Modal({
    title: 'Создать объект.',
    name: 'Название объекта',
    type: true,
    submit: {
      label: 'Создать',
      color: 'btn-primary'
    }
  });

  modal.submit(result => {
    store.mutations.createChild(i, result.name, result.type);
    modal.hide(() => render());
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