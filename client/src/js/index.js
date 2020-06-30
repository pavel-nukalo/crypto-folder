import '@/css/style.css';

import 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'popper.js';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
// import '@fortawesome/fontawesome-free/js/brands';
import axios from 'axios';

import Navbar from '@/js/components/Navbar';
import SigninEmail from '@/js/components/SigninEmail';
import Archives from '@/js/components/Archives';

axios.interceptors.request.use(config => {
  Navbar.processing.fadeIn();
  return config;
}, error => {
  Navbar.processing.fadeOut();
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  Navbar.processing.fadeOut();
  return response;
}, error => {
  Navbar.processing.fadeOut();
  
  if (
    error.response && 
    error.response.status == 401 && 
    error.response.config.url !== '/api/authentication/signin/email' && 
    error.response.config.url !== '/api/authentication/signin/code'
  ) SigninEmail.render();

  return Promise.reject(error);
});

Navbar.init();
Archives.render();