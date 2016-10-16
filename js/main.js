var main = new Vue({
    el: '.main',
    data: {
        pokeId: ''
    },
    methods: {
        handleForm: function(){
            console.log('submited');
            router.go(`/pokemon/${this.pokeId}`);
        },
    },
    ready: function(){
        console.log('ready');
    }
});

console.log(main.$children[0]);
// console.log(main._data);

var App = Vue.extend({});

var pokeInfo = {
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
        msg: 'lol',
        pokeId: ''
};

var pokemonView  = Vue.extend({
    ready: function(){
        console.log('poke ready');
        console.log(this.$route.params.id);
        this.getPokeInfo(this.$route.params.id);
    },
    methods: {
        getPokeInfo: function(id) {
            console.log('getting info');
            this.$http.get('http://pokeapi.co/api/v2/pokemon/'+id).then(function(data){
            var b = data.body;
            //console.log(b);
            pokeInfo.name = b.name;
            pokeInfo.id = b.id;
            pokeInfo.sprite =  b.sprites.front_default;
            pokeInfo.weight = b.weight / 10;
            pokeInfo.height = b.height / 10;

            pokeInfo.types = b.types.map(v => v.type.name);

            pokeInfo.abilities = b.abilities.map(v => v.ability.name);

            pokeInfo.attacks = b.moves.map(v => v.move.name);

            pokeInfo.stats = b.stats.map(v => `${v.stat.name} : ${v.base_stat}`);

            this.$http.get('http://pokeapi.co/api/v2/pokemon-species/'+pokeInfo.id+'/').then(function(response){
                var r = response.body;
                pokeInfo.description = r.flavor_text_entries[1].flavor_text;
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
    },
    data: function(){
        return pokeInfo
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
        Description: {{ description }}<br>`,
    watch:{
        '$route.params.id': function(val, oldVal) {
            this.getPokeInfo(this.$route.params.id);
        }
    }
});

var router = new VueRouter();

router.map({
    '/pokemon/:id': {
        component: pokemonView
    }
});

router.start(App, '.main');