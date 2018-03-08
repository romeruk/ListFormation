<template>
  <div>
    <div class="row">
        <table class="striped bordered responsive-table">
        <thead class="gradient-cyan-45 white-text">
          <tr>
              <th>Номенклатура</th>
              <th>Ціна за одиницю</th>
              <th>Кількість</th>
              <th>Сума</th>
              <th></th>
          </tr>
        </thead>
        <tbody>
            <tr 
              v-for="(item, index) in purchases" 
              :key="item.id" 
              :class="{ 'gradient-amber-light-45': item.checked}">
              <td>
                  <input 
                    v-model="item.checked" 
                    type="checkbox" 
                    class="filled-in" 
                    :id="'filled-in-box-' + item.id" 
                    checked="checked" 
                  />
                  <label :for="'filled-in-box-' + item.id" class="black-text">{{item.title}}</label>
                  
              </td>
              <td>{{item.value}}</td>
              <td>{{item.numberOfTyres}}</td>
              <td>{{item.amount}}</td>
              <td class="center-align"> 
                <a @click="removePurchase (item, index)" class="btn btn-small waves-effect waves-light teal"><i class="material-icons">remove</i></a>
                <a @click="itemEditMode (item)" class="btn btn-small waves-effect waves-light teal"><i class="material-icons">edit</i></a>
              </td>
            </tr>
        </tbody>
      </table>
    </div>
    <div class="row hoverable gradient-cyan-45 white-text"> 
      <div class="col s12 m4">
        <blockquote>
          <p class="flow-text">Загальна сума: <span class="flow-text-span">{{valueOfItems}}</span> грн</p>
        </blockquote>
      </div>
      <div class="col s12 m4">
        <p class="flow-text center-align">Загальна кількість: <span class="flow-text-span">{{countItems}}</span> шт</p>
      </div>

      <div class="col s12 m4">
        <p class="flow-text right-align">
          <a @click="removeChecked" class="waves-effect waves-light btn">Видалити вибрані</a>
        </p>
      </div>
    </div>
  </div>  
</template>

<script>
export default {
  props: {
    purchases: {
      type: Array,
      required: true
    },
    itemTitle: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    numberOfTyres: {
      type: [String, Number],
      required: true
    },
    editMode: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
        
    }
  },
  methods: {
    removePurchase (item, index) {
      this.purchases.splice(index, 1);
      Materialize.toast(`${item.title} успішно видалений`, 2000)
      localStorage.setItem('purchasesItems', JSON.stringify(this.purchases));
    },
    removeChecked () {
      this.purchases.filter(item => item.checked).forEach(find => this.purchases.splice(this.purchases.findIndex(el => el.checked === find.checked), 1));
      localStorage.setItem('purchasesItems', JSON.stringify(this.purchases));
    },
    itemEditMode (item) {
      $('#modal1').modal('open');
      this.$emit('update:editMode', true);
      this.$emit('update:itemTitle', item.title);
      this.$emit('update:value', item.value);
      this.$emit('update:numberOfTyres', item.numberOfTyres);
      this.$emit('editableItem', item);
    }
  },
  computed: {
    valueOfItems: function () {
      return this.purchases.reduce((total, order) => total + order.amount, 0);
    },
    countItems: function () {
      return this.purchases.reduce((prev, next) => prev + next.numberOfTyres, 0);
    }
  }
}
</script>

<style scoped>
.gradient-cyan-45 {
  background: linear-gradient(45deg, #0288d1 0%, #26c6da 100%);
}
.gradient-amber-light-45 {
  background: linear-gradient(45deg, #ffc9281e 0%, #ff6f0044 100%);
}
th {
  border-radius: 0;
}
.flow-text-span {
  font-weight: 400;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>

