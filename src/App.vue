<template>
<div id="container">
  
  <div class="container-center">
    <app-table-orders 
      @editableItem="editableItem = $event" 
      :purchases="items" 
      :itemTitle.sync="itemTitle" 
      :value.sync="value" 
      :numberOfTyres.sync="numberOfTyres" 
      :editMode.sync="editMode">
    </app-table-orders>
  </div>

  <div id="modal1" class="modal">
    <div class="modal-content">
      <h4 v-if="!editMode">Додати новий товар</h4>
      <h4 v-else>Редагування: <span class="blue-text">{{editableItem.title}}</span></h4>
      <form v-on:submit.prevent="addPurchase" class="col s12">
        <div class="row">
          <div class="input-field col s12 m12">
            <input
              v-model="itemTitle"
              @change="updateValue($event.target.value)"
              @input="$v.itemTitle.$touch()"
              type="text" id="autocomplete-input"
              autocomplete="off"
              class="autocomplete"
            >
            <label for="autocomplete-input">Назва</label>
            <span 
              v-if="!$v.itemTitle.required"
              class="blue-text text-darken-2">Поле обов'язкове для заповнення
            </span>
            <span 
              v-if="!$v.itemTitle.minLength"
              class="blue-text text-darken-2">Мінімальна кількість символів {{ $v.itemTitle.$params.minLength.min }}
            </span>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12 m6">
            <input 
              v-model.number="value" 
              @input="$v.value.$touch()"
              id="item_value" 
              type="text" 
              class="validate"
            >
            <label for="item_value">Ціна</label>
            <span 
              v-if="!$v.value.required"
              class="blue-text text-darken-2">Поле обов'язкове для заповнення
            </span>
            <span 
              v-if="!$v.value.between"
              class="blue-text text-darken-2">Значення повинно бути між {{$v.value.$params.between.min}} і {{$v.value.$params.between.max}}
            </span>
          </div>
          <div class="input-field col s12 m6">
            <input
              v-model.number="numberOfTyres"
              @input="$v.numberOfTyres.$touch()"
              id="item_count" type="text" 
              class="validate"
            >
            <label for="item_count">Кількість</label>
            <span 
              v-if="!$v.numberOfTyres.required"
              class="blue-text text-darken-2">Поле обов'язкове для заповнення
            </span>
            <span 
              v-if="!$v.numberOfTyres.between"
              class="blue-text text-darken-2">Значення повинно бути між {{$v.numberOfTyres.$params.between.min}} і {{$v.numberOfTyres.$params.between.max}}
            </span>
          </div>
        </div>
        <div class="row">
          <template v-if="!editMode">
            <button class="btn blue lighten-1 white-text waves-effect waves-purple" type="submit" name="action">Додати
              <i class="material-icons right">send</i>
            </button>
          </template>
          <template v-else>
            <a @click="editItem" class="waves-effect waves-light btn amber"><i class="material-icons right">edit</i>Редагувати</a>
          </template>
        </div>    
      </form>
    </div>
  </div>

  <div class="fixed-action-btn">
    <a class="btn-floating btn-large red modal-trigger pulse" href="#modal1">
      <i class="large material-icons">add</i>
    </a>
  </div>
</div>
  
</template>

<script>
import appTableOrders from './components/appTableOrders.vue';
import tyreData from './components/data';
import { required, minLength, between, sameAs } from 'vuelidate/lib/validators';

export default {
  name: 'app',
  components: {
    appTableOrders
  },
  data () {
    return {
      items: [],
      itemTitle: '',
      value: "",
      numberOfTyres: "1",
      editMode: false,
      editableItem: {}
    }
  },
  validations: {
    itemTitle: {
      required,
      minLength: minLength(5)
    },
    value: {
      required,
      between: between(1, 20000)
    },
    numberOfTyres: {
      required,
      between: between(1, 500)
    },
    validationGroup: ['itemTitle', 'value', 'numberOfTyres']
  },
  created: function () {
    this.items = JSON.parse(localStorage.getItem('purchasesItems') || '[]');
  },
  mounted () {
    $('.modal').modal({
      complete: () => this.editMode = false
    });
    $(function () {
      $('input.autocomplete').autocomplete({
        data: tyreData
      });
    });
  },
  methods: {
    addPurchase () {
      this.$v.validationGroup.$touch()
      if (!this.$v.validationGroup.$error) {
        this.items.push({
          id: typeof this.items[this.items.length - 1] != "undefined" ? this.items[this.items.length - 1].id + 1 : 0,
          title: this.itemTitle,
          value: this.value,
          numberOfTyres: this.numberOfTyres,
          amount: this.value * this.numberOfTyres,
          checked: false
        });
        $('#modal1').modal('close');
        this.clearFields ();
        localStorage.setItem('purchasesItems', JSON.stringify(this.items));
      }
    },
    clearFields () {
      this.itemTitle = '';
      this.value = '';
      this.numberOfTyres = '1';
    },
    updateValue (value) {
      this.itemTitle = value;
    },
    editItem () {
      this.$v.validationGroup.$touch()
      if (!this.$v.validationGroup.$error) {
        this.editableItem.value = this.value;
        this.editableItem.amount = this.value * this.numberOfTyres;
        this.editableItem.title = this.itemTitle;
        this.editableItem.numberOfTyres = this.numberOfTyres;
        $('#modal1').modal('close');
        this.clearFields ();
        localStorage.setItem('purchasesItems', JSON.stringify(this.items));
      }
    }
  }
}
</script>

<style>
.container-center {
  max-width: 1170px;
  margin: 0 auto;
}

</style>
