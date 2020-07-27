import React, { useState } from 'react';
import './App.css';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import AutoComplete from '@material-ui/lab/Autocomplete';

import pokemon from './pokemon.js'

const level = 0.7903;
const nerf = 0.91;

function attack(atk, spa, spe) {
  let min, max;

  if (atk > spa) { min = spa; max = atk; }
  else { min = atk; max = spa; }

  let a = Math.round(2 * (0.875 * max + 0.125 * min));
  let s = 1 + (spe - 75) / 500;

  return Math.round(a * s*nerf);
}

function defense(def, spd, spe) {
  let min, max;

  if (def > spd) { min = spd; max = def; }
  else { min = def; max = spd; }

  let a = Math.round(2 * (0.875 * max + 0.125 * min));
  let s = 1 + (spe - 75) / 500;

  return Math.round(a * s*nerf);
}

function stamina(hp_stat) { return Math.floor((1.75 * hp_stat + 50)*nerf); }

function cp_calc(atk, def, hp, mod) {
  let iv = 15;
  mod = mod ? mod : level;

  atk = (atk + iv) ;
  def = (def + iv);
  hp = (hp + iv) ;
  return Math.floor((atk * Math.pow(def, 0.5) * Math.pow(hp, 0.5) * Math.pow(mod, 2)) / 10);
    
}

function App() {
  const [atk, setAtk] = useState(0);
  const [def, setDef] = useState(0);
  const [hp, setHp] = useState(0);

  const [msHp, setMsHp] = useState(0);
  const [msAtk, setMsAtk] = useState(0);
  const [msDef, setMsDef] = useState(0);
  const [msSpa, setMsSpa] = useState(0);
  const [msSpd, setMsSpd] = useState(0);
  const [msSpe, setMsSpe] = useState(0);
  

  const[imgUrl, setImgUrl] = useState('');
  return (
    <div className="App">
      <TextField label='Attack' value={atk} />
      <TextField label='Defense' value={def} />
      <TextField label='HP' value={hp} />
      <br />
    
      {/* <AutoComplete
          margin='normal'
          type='text'
          id='pokemon1'
          options={pokemon}
          className='form-items'
          renderInput={(params) => <TextField
            {...params} label='Skcid 1 Pokemon' variant='outlined'
            value={pokemon1}
            onChange={(e) => { setPokemon1(e.target.value); setType1(pokemonEnum[e.target.value]); }}
          />}
          onChange={(e, v) => { setPokemon1(v); setType1(pokemonEnum[v]); }}
        /> */}
      <Button color='primary' variant='contained' onClick={() => {
        fetch('https://pokeapi.co/api/v2/pokemon/mewtwo').then(res=> res.json()).then((data)=>{
          // data.stats[] 0 = hp, 1=atk, 2=def, 3=spa, 4=spd, 5=spe
          setMsHp(data.stats[0].base_stat);
          setMsAtk(data.stats[1].base_stat);
          setMsDef(data.stats[2].base_stat);
          setMsSpa(data.stats[3].base_stat);
          setMsSpd(data.stats[4].base_stat);
          setMsSpe(data.stats[5].base_stat);

          setAtk(attack(msAtk, msSpa, msSpe));
          setDef(defense(msDef, msSpd, msSpe));
          setHp(stamina(msHp));
          setImgUrl(data.sprites.front_shiny);
        });
      }}>Calculate</Button>
      <br />
      <h1>Max CP at 100% IV: {cp_calc(atk, def, hp)}</h1>
      <img src={imgUrl} alt=''/>
    </div>
  );
}

export default App;
