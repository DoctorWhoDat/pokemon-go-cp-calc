import React, { useState, useEffect } from 'react';
import './App.css';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import AutoComplete from '@material-ui/lab/Autocomplete';

import pokemon from './pokemon.js'

const level = 0.7903;
const nerf = 0.91;

function attack(atk, spa, spe, n) {
  let min, max;

  if (atk > spa) { min = spa; max = atk; }
  else { min = atk; max = spa; }

  let a = Math.round(2 * (0.875 * max + 0.125 * min));
  let s = 1 + (spe - 75) / 500;

  return Math.round(a * s * n);
}

function defense(def, spd, spe, n) {
  let min, max;

  if (def > spd) { min = spd; max = def; }
  else { min = def; max = spd; }

  let a = Math.round(2 * (0.625 * max + 0.375 * min));
  let s = 1 + (spe - 75) / 500;

  return Math.round(a * s * n);
}

function stamina(hp_stat, n) {

  return hp_stat !== 0 ? Math.round(Math.floor(1.75 * hp_stat + 50) * n) : 0;
}

function cp_calc(atk, def, hp, mod) {
  let iv = 15;
  mod = mod ? mod : level;

  atk = (atk + iv);
  def = (def + iv);
  hp = (hp + iv);
  return Math.floor((atk * Math.pow(def, 0.5) * Math.pow(hp, 0.5) * Math.pow(mod, 2)) / 10);

}

function App() {
  const [name, setName] = useState('');
  const [atk, setAtk] = useState(0);
  const [def, setDef] = useState(0);
  const [hp, setHp] = useState(0);
  const [cp, setCp] = useState(0);
  const [nonNerf, setNonNerf] = useState(0);

  // const [msHp, setMsHp] = useState(0);
  // const [msAtk, setMsAtk] = useState(0);
  // const [msDef, setMsDef] = useState(0);
  // const [msSpa, setMsSpa] = useState(0);
  // const [msSpd, setMsSpd] = useState(0);
  // const [msSpe, setMsSpe] = useState(0);

  // useEffect(() => {
  //   let n = 1;
  //   setAtk(attack(msAtk, msSpa, msSpe, n));
  //   setDef(defense(msDef, msSpd, msSpe, n));
  //   setHp(stamina(msHp, n));

  //   let res = cp_calc(atk, def, hp);

  //   if (res > 4000) {
  //     n = nerf;
  //     setNonNerf(res);
  //     setAtk(attack(msAtk, msSpa, msSpe, n));
  //     setDef(defense(msDef, msSpd, msSpe, n));
  //     setHp(stamina(msHp, n));

  //     setCp(cp_calc(atk, def, hp));
  //   } else { setCp(res); }

  // }, [msAtk, msDef, msHp, msSpa, msSpd, msSpe, atk, def, hp]);

  const [imgUrl, setImgUrl] = useState('');
  return (
    <div className="App">
      <TextField label='Attack' value={atk} />
      <TextField label='Defense' value={def} />
      <TextField label='HP' value={hp} />
      <br />
      <br />

      <AutoComplete
        margin='normal'
        type='text'
        id='pokemon1'
        options={pokemon}
        className='form-items'
        freeSolo={true}
        renderInput={(params) => <TextField
          {...params} label='Skcid 1 Pokemon' variant='outlined'
          value={name}
          onChange={(e) => {

            setName(e.target.value);
          }}
        />}
        onChange={(e, v) => { setName(v); }}
      />
      <br />
      <Button color='primary' variant='contained' onClick={() => {
        if (name !== '') {
          fetch('https://pokeapi.co/api/v2/pokemon/' + name.replace(' ', '-').toLowerCase()).then(res => res.json()).then((data) => {
            // data.stats[] 0 = hp, 1=atk, 2=def, 3=spa, 4=spd, 5=spe
            // setMsHp(data.stats[0].base_stat);
            // setMsAtk(data.stats[1].base_stat);
            // setMsDef(data.stats[2].base_stat);
            // setMsSpa(data.stats[3].base_stat);
            // setMsSpd(data.stats[4].base_stat);
            // setMsSpe(data.stats[5].base_stat);

            let msHp = data.stats[0].base_stat,
              msAtk = data.stats[1].base_stat,
              msDef = data.stats[2].base_stat,
              msSpa = data.stats[3].base_stat,
              msSpd = data.stats[4].base_stat,
              msSpe = data.stats[5].base_stat;

            setImgUrl(data.sprites.front_shiny || data.sprites.front_default);

            let n = 1, a = attack(msAtk, msSpa, msSpe, n), d = defense(msDef, msSpd, msSpe, n), h = stamina(msHp, n);
            setAtk(attack(msAtk, msSpa, msSpe, n));
            setDef(defense(msDef, msSpd, msSpe, n));
            setHp(stamina(msHp, n));

            let res = cp_calc(a, d, h);
            setNonNerf(0);

            if (res > 4000) {
              n = nerf;
              setNonNerf(res);
              setAtk(attack(msAtk, msSpa, msSpe, n));
              setDef(defense(msDef, msSpd, msSpe, n));
              setHp(stamina(msHp, n));
              a = attack(msAtk, msSpa, msSpe, n);
              d = defense(msDef, msSpd, msSpe, n);
              h = stamina(msHp, n);
              setCp(cp_calc(a, d, h));
            } else { setCp(res); }
          }).catch((err)=>{setCp('Error')});
        }
      }}>Calculate</Button>
      <br />
      <h1>Max CP at 100% IV: {cp}</h1>
      <h1>{nonNerf !== 0 && nonNerf}</h1>
      <img src={imgUrl} alt='' />
      <br />
      <h2>Directions: Start typing the name of the Pokemon and select from list. <br />Gen 7 is also accessible, just type it and make sure it's spelled right (will add soon)<br />For different forms, add a "-mega" or "-primal". For Mewtwo and Charizard, type "-mega-x".<br />Then click "Calculate".</h2>
    </div>
  );
}

export default App;
