var app = new Vue({
    el: '#app',
    data: {
      items: [],
      text: '',
      expDate: '',
      show: 'all',
      drag: {}
    },
    computed: {
      activeItems: function() {
        return this.items.length;
      },
      filteredItems: function() {
        if (this.show === 'active')
            return this.items.filter(function(item) {
              return !item.expired;
          });
        if (this.show === 'expired')
            return this.items.filter(function(item) {
              return item.expired;
            });
        return this.items;
      },
    },
    methods: {
      created: function() {
        this.getItems();
      },
      addItem: function() {
        axios.post("/api/items", {
            text: this.text,
            expDate: this.expDate,
            expired: (Date.parse(this.expDate) < Date.now())
          }).then(response => {
            this.text = '';
            this.expDate = '';
            this.getItems();
            return true;
          }).catch(err => {
        });
      },
      deleteItem: function(item) {
        axios.delete("/api/items/" + item.id).then(response => {
            this.getItems();
            return true;
          }).catch(err => {
        });
      },
      showAll: function() {
        this.getItems();
        this.show = 'all';
      },
      showExpired: function() {
        this.getItems();
        this.show = 'expired';
      },
      deleteExpired: function() {
        this.getItems();
        this.items.forEach(item => {
          if (item.expired)
            this.deleteItem(item)
        });
      },
      dragItem: function(item) {
        this.drag = item;
      },
      dropItem: function(item) {
        axios.put("/api/items/" + this.drag.id, {
            text: this.drag.text,
            expDate: this.drag.expDate,
            expired: this.drag.expired,
            orderChange: true,
            orderTarget: item.id
          }).then(response => {
            this.getItems();
            return true;
          }).catch(err => {
        });
      },
      getItems: function() {
        this.updateExp();
        axios.get("/api/items").then(response => {
            this.items = response.data;
            return true;
          }).catch(err => {
        });
      },
      updateExp: function() {
        this.items.forEach(item => {
            item.expired = Date.parse(item.expDate) < Date.now();
        });
      },
      orderName: function() {
        this.items.sort((a, b) => {
          return a.text > b.text;
        });
      },
      orderExp: function() {
        this.items.sort((a, b) => {
          return Date.parse(a.expDate) - Date.parse(b.expDate);
        });
      }
    }
});