'use strict';
const Pet = (() => {
  const KEY = 'learningPlayground.pet.v1';
  const LOCK = 'learningPlayground.pet.v1.write';
  const species = {owl:'Owl', cat:'Cat', dragon:'Dragon'};
  const foods = {
    berry:{label:'Berry bowl', price:2, growth:1, icon:'🫐'},
    feast:{label:'Rainbow snack', price:4, growth:2, icon:'🥕'},
  };
  const outfits = {
    scarf:{label:'Cozy scarf', price:5, icon:'🧣'},
    crown:{label:'Star crown', price:8, icon:'👑'},
  };
  const decor = {
    plant:{label:'Leafy plant', price:4, icon:'🪴'},
    lamp:{label:'Star lamp', price:6, icon:'🌟'},
  };
  const stages = [
    {growth:0, names:{cat:'Kitten',dragon:'Egg',owl:'Egg'}},
    {growth:2, names:{cat:'Playful kitten',dragon:'Hatchling',owl:'Owlet'}},
    {growth:8, names:{cat:'Young cat',dragon:'Young dragon',owl:'Young owl'}},
    {growth:24, names:{cat:'Adult cat',dragon:'Adult dragon',owl:'Adult owl'}},
    {growth:60, names:{cat:'Star cat',dragon:'Star dragon',owl:'Star owl'}},
  ];
  const maxGrowth = stages[stages.length - 1].growth;
  let api, current = null, snapshot = null, problem = '', notice = '', active = false, tapped = false;

  function valid(record) {
    if (!record || typeof record !== 'object' || Array.isArray(record) || record.version !== 1 ||
        typeof record.species !== 'string' || !Object.hasOwn(species, record.species) || typeof record.name !== 'string' ||
        !record.name.trim() || record.name !== record.name.trim() || record.name.length > 20 ||
        !Number.isSafeInteger(record.spent) || record.spent < 0 ||
        !Number.isSafeInteger(record.growth) || record.growth < 0 || record.growth > maxGrowth ||
        !record.inventory || !record.equipped) return false;
    let cost = record.growth * 2;
    for (const [group, catalog, slot] of [['outfits', outfits, 'outfit'], ['decor', decor, 'decor']]) {
      const owned = record.inventory[group], selected = record.equipped[slot];
      if (!Array.isArray(owned) || new Set(owned).size !== owned.length ||
          owned.some(id => typeof id !== 'string' || !Object.hasOwn(catalog, id)) ||
          (selected !== null && !owned.includes(selected))) return false;
      cost += owned.reduce((sum, id) => sum + catalog[id].price, 0);
    }
    return cost === record.spent;
  }
  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw === null) return {raw, value:null};
      const value = JSON.parse(raw);
      if (!valid(value)) return {raw, error:'Pet data is invalid. No changes were made; restore the saved data to continue.'};
      return {raw, value};
    } catch (error) {
      if (error instanceof SyntaxError) return {error:'Pet data is invalid. No changes were made; restore the saved data to continue.'};
      api.storageFailure();
      return {error:'Pet storage is unavailable. Changes cannot be saved on this device.'};
    }
  }
  function refresh() {
    const result = read();
    problem = result.error || '';
    if (!problem) { snapshot = result.raw; current = result.value; }
    else { snapshot = null; current = null; }
  }
  function earnings() {
    try {
      const value = api.getEarnings();
      return Number.isSafeInteger(value) && value >= 0 ? value : null;
    } catch { return null; }
  }
  function balance() {
    if (problem) return null;
    const earned = earnings();
    return earned === null || (current && earned < current.spent) ? null : earned - (current ? current.spent : 0);
  }
  function stageIndex(growth) {
    return stages.reduce((current,stage,index) => growth >= stage.growth ? index : current,0);
  }
  function sound(name) {
    if (api.SND && typeof api.SND[name] === 'function') api.SND[name]();
  }
  async function change(mutator, success, focusId, spending = false) {
    if (problem) return;
    if (typeof navigator === 'undefined' || !navigator.locks || typeof navigator.locks.request !== 'function') {
      notice = 'Safe saving is unavailable in this browser. Pet changes are disabled to protect your stars.';
      render(); return;
    }
    const expected = snapshot;
    try {
      await navigator.locks.request(LOCK, () => {
        const latest = read();
        if (latest.error) { problem = latest.error; current = null; return; }
        if (latest.raw !== expected) {
          snapshot = latest.raw; current = latest.value;
          notice = 'Your pet changed in another tab. The latest pet is shown; please try again.';
          return;
        }
        const available = balance();
        if (spending && available === null) {
          notice = 'Star earnings are unavailable or lower than your saved spending. No changes were made.';
          return;
        }
        const next = current ? JSON.parse(JSON.stringify(current)) : null;
        const result = mutator(next, available);
        if (typeof result === 'string') { notice = result; return; }
        if (!valid(result)) { notice = 'This change could not be saved.'; return; }
        const raw = JSON.stringify(result);
        try {
          localStorage.setItem(KEY, raw);
          if (localStorage.getItem(KEY) !== raw) throw new Error('Save could not be verified');
        } catch {
          api.storageFailure();
          problem = 'Pet storage is unavailable. The change could not be confirmed; reload to check your pet.';
          current = null; snapshot = null; return;
        }
        snapshot = raw; current = result; notice = success;
        sound('ok');
      });
    } catch {
      notice = 'Safe saving is unavailable. No pet change was confirmed.';
    }
    if (api.updateHeader) api.updateHeader();
    if (active) {
      render();
      const target = focusId && api.$('#' + focusId);
      if (target && typeof target.focus === 'function') target.focus();
    }
  }
  function button(label, action, id, disabled) {
    const props = {class:'btn pet-button', type:'button', onclick:action};
    if (id) props.id = id;
    if (disabled) props.disabled = 'disabled';
    return api.el('button', props, label);
  }
  function art(id, className) {
    return api.el('img', {src:`pet-${id}.svg`, alt:'', class:className, width:'180', height:'180'});
  }
  function setup() {
    const e = api.el;
    const name = e('input', {id:'pet-name', maxlength:'20', required:'required', autocomplete:'off'});
    const choices = Object.entries(species).map(([id, label]) => {
      const input = e('input', {type:'radio', name:'pet-species', value:id, required:'required'});
      return {id, input, label:e('label', {class:'pet-species'}, input, art(id, 'pet-choice-art'), e('strong', {}, label))};
    });
    const confirm = e('input', {type:'checkbox', id:'pet-confirm'});
    const submit = e('form', {class:'pet-setup', onsubmit:event => {
      event.preventDefault();
      const cleanName = name.value.trim();
      const choice = choices.find(item => item.input.checked);
      if (!cleanName || cleanName.length > 20) { notice = 'Choose a name of up to 20 characters.'; api.$('#pet-status').textContent = notice; name.focus(); return; }
      if (!confirm.checked) { notice = 'Please confirm your species choice is permanent.'; api.$('#pet-status').textContent = notice; confirm.focus(); return; }
      if (!choice) { notice = 'Choose a pet species.'; api.$('#pet-status').textContent = notice; return; }
      return change((old) => old ? 'Your pet already has a species.' : {
        version:1, species:choice.id, name:cleanName, spent:0, growth:0,
        inventory:{outfits:[], decor:[]}, equipped:{outfit:null, decor:null},
      }, `Welcome home, ${cleanName}!`, 'pet-tap');
    }},
    e('fieldset', {class:'pet-choices'}, e('legend', {}, 'Choose your friend'), ...choices.map(item => item.label)),
    e('label', {for:'pet-name'}, 'Your pet’s name (up to 20 characters)'), name,
    e('label', {class:'pet-confirm'}, confirm, ' I understand this species choice is permanent on this device.'),
    e('button', {class:'btn pet-button', type:'submit'}, 'Welcome your pet'));
    return e('section', {class:'pet-panel'}, e('h2', {}, 'Meet your companion'),
      e('p', {}, 'Choose carefully: your pet’s species cannot be changed later. Your friend will always be happy to see you.'), submit);
  }
  function shopGroup(title, catalog, kind, available) {
    const e = api.el;
    return e('section', {class:'pet-panel'}, e('h2', {}, title),
      e('div', {class:'pet-shop-grid'}, ...Object.entries(catalog).map(([id, item]) => {
        const owned = kind !== 'food' && current.inventory[kind].includes(id);
        const tooLarge = kind === 'food' && current.growth + item.growth > maxGrowth;
        const unavailable = available === null || available < item.price || owned || tooLarge;
        const why = owned ? 'Already owned' : tooLarge ? 'Maximum growth reached' :
          available === null ? 'Balance unavailable' : available < item.price ? 'Not enough stars' : '';
        const action = () => change((next, stars) => {
          if (!next) return 'Choose a pet first.';
          if (stars < item.price) return 'Not enough stars.';
          if (kind === 'food') {
            if (next.growth + item.growth > maxGrowth) return 'That snack would exceed maximum growth.';
            next.growth += item.growth;
          } else {
            if (next.inventory[kind].includes(id)) return 'Already owned.';
            next.inventory[kind].push(id);
          }
          next.spent += item.price;
          return next;
        }, kind === 'food' ? `${current.name} enjoyed the ${item.label}!${stageIndex(current.growth) !== stageIndex(current.growth + item.growth) ? ' A new growth stage! 🎉' : ''}` : `${item.label} added to your inventory!`, `pet-buy-${id}`, true);
        return e('article', {class:'pet-item'}, e('div', {class:'pet-item-icon', 'aria-hidden':'true'}, item.icon),
          e('h3', {}, item.label), e('p', {}, `${item.price} stars${kind === 'food' ? ` · +${item.growth} growth` : ''}`),
          button(`${kind === 'food' ? 'Feed' : 'Buy'} ${item.label}`, action, `pet-buy-${id}`, unavailable),
          why ? e('small', {}, why) : null);
      })));
  }
  function inventoryGroup(title, group, slot, catalog) {
    const e = api.el;
    const owned = current.inventory[group], selected = current.equipped[slot];
    return e('section', {class:'pet-inventory-group'}, e('h3', {}, title),
      !owned.length ? e('p', {}, 'Nothing here yet.') : e('div', {class:'pet-inventory-buttons'},
        ...owned.map(id => button(`${catalog[id].icon} ${catalog[id].label}${selected === id ? ' (equipped)' : ''}`,
          () => change(next => { if (!next || !next.inventory[group].includes(id)) return 'This item is not owned.'; next.equipped[slot] = id; return next; },
            `${catalog[id].label} equipped!`, `pet-equip-${id}`), `pet-equip-${id}`, selected === id)),
        selected ? button(`Remove ${catalog[selected].label}`, () => change(next => {
          if (!next) return 'Choose a pet first.'; next.equipped[slot] = null; return next;
        }, 'Item removed. It stays in your inventory.', `pet-equip-${selected}`), `pet-remove-${slot}`) : null));
  }
  function home() {
    const e = api.el, available = balance(), index = stageIndex(current.growth), next = stages[index + 1];
    const image = index === 0 ? (current.species === 'cat' ? 'kitten' : 'egg') : current.species;
    const outfit = current.equipped.outfit && outfits[current.equipped.outfit];
    const decoration = current.equipped.decor && decor[current.equipped.decor];
    return [
      e('section', {class:'pet-home-panel'},
        e('div', {class:'pet-room'}, decoration ? e('span', {class:'pet-room-decor', role:'img', 'aria-label':decoration.label}, decoration.icon) : null,
          e('button', {id:'pet-tap', class:`pet-tap pet-stage-${index + 1}${tapped ? ' pet-tapped' : ''}`, type:'button', 'aria-label':`Give ${current.name} a friendly tap`, onclick:() => {
            notice = `${current.name} is happy to see you!`; tapped = true; sound('ok'); render(); tapped = false; const tap = api.$('#pet-tap'); if (tap) tap.focus();
          }}, e('span', {class:'pet-portrait'},
            art(image, 'pet-home-art'),
            index === 1 && current.species !== 'cat' ? e('span', {class:'pet-hatch-shell','aria-hidden':'true'}) : null,
            index === 2 ? e('span', {class:'pet-growth-accent','aria-hidden':'true'},'🌱') : null,
            index === 3 ? e('span', {class:'pet-growth-accent','aria-hidden':'true'},'⭐') : null,
            index === 4 ? e('span', {class:'pet-growth-accent','aria-hidden':'true'},'✨') : null),
            e('span', {}, 'Tap your pet to say hello')),
          outfit ? e('span', {class:'pet-room-outfit', role:'img', 'aria-label':outfit.label}, outfit.icon) : null),
        e('div', {class:'pet-home-copy'}, e('h2', {}, current.name), e('p', {}, `Stage ${index + 1} of 5 · ${stages[index].names[current.species]}`),
          e('p', {class:'pet-balance'}, available === null ? 'Star balance unavailable' : `${available} stars to spend`),
          e('p', {}, next ? `${current.growth} of ${next.growth} growth points · ${next.growth - current.growth} more to ${next.names[current.species]}` : 'Maximum growth reached!'),
          e('progress', {max:String(next ? next.growth : maxGrowth), value:String(current.growth), 'aria-label':'Growth toward next stage'}),
          e('ol', {class:'pet-stages','aria-label':'Pet growth stages'},...stages.map((stage,stageNumber) =>
            e('li', stageNumber === index ? {'aria-current':'step'} : {},`${stageNumber + 1}. ${stage.names[current.species]}`))),
          e('p', {}, 'Your pet never loses growth and is always glad to see you.'))),
      available === null ? e('p', {class:'pet-warning'}, 'Star earnings are unavailable or lower than your saved spending. Purchases are paused; your items are safe.') : null,
      shopGroup('Food', foods, 'food', available), shopGroup('Outfits', outfits, 'outfits', available), shopGroup('Room decorations', decor, 'decor', available),
      e('section', {class:'pet-panel'}, e('h2', {}, 'Your inventory'), e('p', {}, 'Equip or remove owned items for free.'),
        inventoryGroup('Outfits', 'outfits', 'outfit', outfits), inventoryGroup('Decorations', 'decor', 'decor', decor)),
    ];
  }
  function render() {
    const e = api.el, root = api.$('#pet');
    root.replaceChildren(e('div', {class:'pet-page'},
      e('div', {class:'pet-heading'}, button('← All subjects', () => api.navigate('subjects')), e('h1', {}, 'Pet home')),
      e('p', {class:'pet-intro'}, 'Spend available stars here. Trophies count all the stars you earned, even after spending.'),
      e('p', {id:'pet-status', class:'pet-status', role:'status', 'aria-live':'polite'}, problem || notice),
      problem ? e('p', {class:'pet-warning'}, 'Your saved pet has not been replaced. Try again when storage is available.') : current ? home() : setup()));
  }
  function init(helpers) {
    api = helpers; active = false; notice = ''; refresh();
    if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('storage', event => {
      if (event.key !== KEY && event.key !== null) return;
      refresh(); notice = 'Pet data changed in another tab.';
      if (api.updateHeader) api.updateHeader();
      if (active) render();
    });
  }
  function handleRoute(path) {
    active = path === 'pet';
    if (!active) return false;
    refresh(); if (api.updateHeader) api.updateHeader(); render(); api.show('pet'); api.focusHeading(); return true;
  }
  return {init, handleRoute, get availableStars() { return balance(); }, get state() { return current ? JSON.parse(JSON.stringify(current)) : null; }};
})();
