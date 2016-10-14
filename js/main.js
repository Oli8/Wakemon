new Vue({
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
        description: '',
    },
    ready: function(){
        console.log('ok');
        this.$http.get('http://pokeapi.co/api/v2/pokemon/croagunk').then(function(data){
            var b = data.body;
            console.log(b);
            this.name = b.name;
            this.id = b.id;
            this.sprite =  b.sprites.front_default;
            this.weight = b.weight / 10;
            this.height = b.height / 10;

            for(v of b.types)
                this.types.push(v.type.name);

            for(v of b.abilities)
                this.abilities.push(v.ability.name);

            for(v of b.moves)
                this.attacks.push(v.move.name);

             for(v of b.stats)
                this.stats.push(v['stat']['name'] + " : " + v['base_stat']);

            this.$http.get('http://pokeapi.co/api/v2/pokemon-species/'+this.id+'/').then(function(response){
                console.log(response.body);
                this.description = response['flavor_text_entries'][1]['flavor_text'];
            }, function(response){
                console.log('error ', data);
            });

        }, function(data){
            console.log('error ', data);
        });
    },
});