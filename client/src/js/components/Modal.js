import $ from 'jquery';

export default class Modal {
  constructor({ title, name, key, remove, type, submit }) {
    const modal = $('#modal');

    if (name) modal.find('#name').removeClass('d-none').find('input').attr('placeholder', name).val('').prop('required', true);
    else modal.find('#name').addClass('d-none').find('input').prop('required', false);

    if (key) modal.find('#key').removeClass('d-none').find('input').attr('placeholder', key).val('').prop('required', true);
    else modal.find('#key').addClass('d-none').find('input').prop('required', false);

    if (remove) modal.find('#remove').removeClass('d-none').find('input').val(remove);
    else modal.find('#remove').addClass('d-none');

    if (type) {
      modal.find('#type').removeClass('d-none');
    } else modal.find('#type').addClass('d-none');


    modal.find('.modal-title').html(title);
    modal.find('#submit').html(submit.label).removeClass().addClass('btn ' + submit.color);
    modal.modal('show');

    this.modal = modal;
  }

  hide(cb) {
    const modal = this.modal;

    modal.modal('hide').on('hidden.bs.modal', () => {
      modal.unbind();
      
      if (cb) cb();
    });
  }

  submit(cb) {
    const modal = this.modal;
    modal.parent().unbind('submit').submit(event => {
      event.preventDefault();

      const result = {
        name: modal.find('#name input').val(),
        key: modal.find('#key input').val(),
        type: modal.find('#type select').val()
      };

      modal.parent().unbind('submit').submit(event => {
        event.preventDefault();
      });
      
      if (cb) cb(result);
    });
  }
}