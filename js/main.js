var main = new Vue({
    el: '.main',
    data: {
        pokeId: ''
    },
    methods: {
        handleForm: function(){
            router.go(`/pokemon/${this.pokeId}`);
        },
    },
});

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
        pokeId: '',
        loaded: false
};

var pokemonView  = Vue.extend({
    ready: function(){
        this.getPokeInfo(this.$route.params.id);
    },
    methods: {
        getPokeInfo: function(id) {
            console.log('getting info');
            this.$http.get('http://pokeapi.co/api/v2/pokemon/'+id).then(function(data){
                pokeInfo.loaded = true;
                var b = data.body;
                
                pokeInfo.name = b.name;
                pokeInfo.id = b.id;
                pokeInfo.sprite =  b.sprites.front_default;
                pokeInfo.weight = b.weight / 10;
                pokeInfo.height = b.height / 10;

                pokeInfo.types = b.types.map(v => v.type.name).join(', ');

                pokeInfo.abilities = b.abilities.map(v => v.ability.name).join(', ');

                pokeInfo.attacks = b.moves.map(v => v.move.name).join(', ');

                pokeInfo.stats = b.stats.map(v => `${v.stat.name} : ${v.base_stat}`).join(', ');

                this.$http.get('http://pokeapi.co/api/v2/pokemon-species/'+pokeInfo.id+'/').then(function(response){
                    var r = response.body;
                    pokeInfo.description = r.flavor_text_entries[1].flavor_text;
                    var evoUrl = r.evolution_chain.url;
                    var url = '';
                    
                    this.$http.get(evoUrl).then(function(data2){
                        var d = data2.body;

                        var pName = d.chain.species.name;
                        pokeInfo.evolutions = [`<a href="index.html#!/pokemon/${pName}">${pName}</a>`];
                        var obj = d.chain;

                        while(obj.evolves_to.length){
                            for(var v of obj.evolves_to) {
                                var name = v.species.name;
                                pokeInfo.evolutions.push(`<a href="index.html#!/pokemon/${name}">${name}</a>`);
                            }
                            obj = obj['evolves_to'][0];
                        }

                        pokeInfo.evolutions = pokeInfo.evolutions.join(', ');
                    });
                }, function(response){
                    this.error = true;
                });

            }, function(data){
                this.error = true;
            });
        },
    },
    data: function(){
        return pokeInfo
    },
    template: `
        <div class="alert alert-danger" role="alert" v-show="error">
          <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>Nothing found
        </div>
        <div class="loading"><img src="loading.GIF" v-show="!loaded && !error"/></div>
        <div id="pokeInfo" v-show="loaded">
            <h2> {{ name | capitalize }} </h2>
            <img src="{{sprite}}" alt="{{name}}"/>
            <span>Id :</span> {{ id }}<br/>
            <span>Weight:</span> {{ weight }}kg<br/>
            <span>Height:</span> {{ height }}m<br/>
            <span>Types:</span> {{ types }}<br/>
            <span>Abilities:</span> {{ abilities }}<br/>
            <span>Attacks:</span> {{ attacks}}<br/> 
            <span>Stats:</span> {{ stats }}<br/>
            <span>Description:</span> {{ description }}<br>
            <span>Evolutions chain:</span> {{{ evolutions }}}
        </div>`,
    watch:{
        '$route.params.id': function(val, oldVal) {
            pokeInfo.loaded = false
            pokeInfo.error = false;
            pokeInfo.description = '';
            pokeInfo.evolutions = [];
            this.getPokeInfo(this.$route.params.id);
        }
    }
});

var router = new VueRouter();

router.map({
    '/pokemon/:id': {
        name: 'pokemon',
        component: pokemonView
    }
});

router.start(App, '.main');