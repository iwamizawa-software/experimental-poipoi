var messages = {};
await Promise.all(vueApp._container._vnode.component.proxy.$i18n.availableLocales.map(async l => {
  Object.keys(messages[l] = eval('(' + await (await fetch('https://raw.githubusercontent.com/iccanobif/gikopoi2/master/src/langs/' + l + '.json')).text() + ')')).forEach(k => {
    if (k !== 'room' && k !== 'default_user_name')
      delete messages[l][k];
  });
}));
console.log(JSON.stringify(messages));
