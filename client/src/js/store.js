import axios from 'axios';
import crypto from './crypto';


const state = {
  archive: null,
  path: null,
  secretKey: null,
  clipboard: null
};

const getters = {
  getArchive: () => state.archive,
  getPath: () => state.path,
  getClipboard: () => state.clipboard,
  
  getBreadcrumbs: () => {
    let breadcrumbs = `${state.archive.name}:`;
    let child = state.archive.data;
    
    state.path.forEach(item => {
      child = child.children[item];
      breadcrumbs += `/${child.name}`;
    });
    
    return breadcrumbs;
  },
  
  getChild: () => {
    let child = state.archive.data;
    state.path.forEach(item => child = child.children[item]);
    return child;
  }
};

const mutations = {
  pushPath: i => state.path.push(i),
  popPath: () => state.path.pop(),
  cleanClipboard: () => state.clipboard = null,
  copyChild: i => state.clipboard = JSON.parse(JSON.stringify(getters.getChild().children[i])),
  
  renameChild: (i, name) => {
    const child = getters.getChild();
    child.lastModified = new Date().toISOString();
    child.children[i].name = name;
  },
  
  deleteChild: i => {
    const child = getters.getChild();
    child.lastModified = new Date().toISOString();
    child.children.splice(i, 1);
  },
  
  pasteChild: i => {
    const child = getters.getChild();
    child.lastModified = new Date().toISOString();
    child.children.splice(i, 0, state.clipboard);
  },
  
  createChild: (i, name, type) => {
    const child = getters.getChild();
    child.lastModified = new Date().toISOString();
    
    child.children.splice(i, 0, {
      name,
      type,
      content: type == 'file' ? '' : null,
      children: type == 'directory' ? [] : null,
      lastModified: new Date().toISOString()
    });
  },
  
  cleanArchive: () => {
    state.archive = null;
    state.secretKey = null;
    state.path = null;
  },
  
  setChildContent: content => {
    const child = getters.getChild();
    child.lastModified = new Date().toISOString();
    child.content = content;
  }
};

const actions = {
  signinEmail: email => axios.post('/api/authentication/signin/email', { email }),
  signinCode: (email, code) => axios.post('/api/authentication/signin/code', { email, code }),
  signout: () => axios.get('/api/authentication/signout'),
  
  fetchArchives: async () => {
    const response = await axios.get('/api/documents/');
    return response.data;
  },
  
  fetchArchive: async (id, secretKey) => {
    const response = await axios.get(`/api/documents/${id}`);
    const archive = response.data;
    if (!archive) throw new Error('Archive not found!');
    
    const data = JSON.parse(crypto.decrypt(archive.data, secretKey));
    if (typeof data != 'object') throw new Error('Decrypted data is not object!');
    
    state.archive = {
      ...archive,
      data
    };
    state.path = [];
    state.secretKey = secretKey;
  },
  
  createArchive: (name, secretKey) => {
    const root = {
      name: '',
      type: 'directory',
      children: []
    };

    return axios.post(`/api/documents/`, { 
      name,
      data: crypto.encrypt(JSON.stringify(root), secretKey)
    });
  },
  
  renameArchive: (id, name) => axios.put(`/api/documents/${id}`, { name }),
  
  deleteArchive: id => axios.delete(`/api/documents/${id}`),
  
  uploadArchive: () => {
    return axios.put(`/api/documents/${state.archive._id}`, { 
      name: state.archive.name,
      data: crypto.encrypt(JSON.stringify(state.archive.data), state.secretKey)
    });
  },
  
  forkArchive: async (name, secretKey) => {
    const response = await axios.post(`/api/documents/`, { 
      name,
      data: crypto.encrypt(JSON.stringify(state.archive.data), secretKey)
    });
    
    const archive = response.data;
    if (!archive) throw new Error('Archive not found!');
    
    const data = JSON.parse(crypto.decrypt(archive.data, secretKey));
    if (typeof data != 'object') throw new Error('Decrypted data is not object!');
    
    state.archive = {
      ...archive,
      data
    };
    state.secretKey = secretKey;
  }
};

export default {
  getters,
  mutations,
  actions
};