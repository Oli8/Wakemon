var main = new Vue({
    el: '.main',
    data: {
        name: '',
        id: '',
        sprite: '',
        weight: '',
        height: '',
        types: [],
        abilities: [],
        attacks: [],
        stats: [],
        evolutions: [],
        description: '',
        error: false,
        msg: 'lol'
    },
    ready: function(){
        this.$http.get('http://pokeapi.co/api/v2/pokemon/croagunk').then(function(data){
            var b = data.body;
            //console.log(b);
            this.name = b.name;
            this.id = b.id;
            this.sprite =  b.sprites.front_default;
            this.weight = b.weight / 10;
            this.height = b.height / 10;

            this.types = b.types.map(v => v.type.name);

            this.abilities = b.abilities.map(v => v.ability.name);

            this.attacks = b.moves.map(v => v.move.name);

            this.stats = b.stats.map(v => `${v.stat.name} : ${v.base_stat}`);

            this.$http.get('http://pokeapi.co/api/v2/pokemon-species/'+this.id+'/').then(function(response){
                var r = response.body;
                this.description = r.flavor_text_entries[1].flavor_text;
                var evoUrl = r.evolution_chain.url;
                console.log(evoUrl); 
                // this.$http.get(evoUrl).then(function(evo){
                //     this.evolutions.push(`<a href="${url}pokemon/${data3['chain']['species']['name']}">${data3['chain']['species']['name']} </a>`)
                // });
            }, function(response){
                console.log('error ', data);
                this.error = true;
            });

        }, function(data){
            console.log('error ', data);
            this.error = true;
        });
    },
    components: {
        my: {
            data: function(){
                return this.$parent.$data;
            },
            template: "<h1>{{ msg }} oo</h1>"
        }
    }
});

console.log(main);
// console.log(main._data);

var App = Vue.extend({});

var pokemonView  = Vue.extend({
    data: function(){
        return this.$root.data
    },
    template: `Name : {{ name | capitalize }}<br/>
        Id : {{ id }}<br/>
        Weight: {{ weight }}<br/>
        Height: {{ height }}<br/>
        Image: {{ sprite }}<br/>
        Types: {{ types.join(', ') }}<br/>
        Abilities: {{ abilities.join(', ') }}<br/>
        Attacks: {{ attacks.join(', ')}}<br/> 
        Stats: {{ stats.join(', ') }}<br/>
        Description: {{ description }}<br>
        Evolution: {{ evolutions }}`
});

var router = new VueRouter();

router.map({
    '/pokemon': {
        component: pokemonView
    }
});

router.start(App, '.main');