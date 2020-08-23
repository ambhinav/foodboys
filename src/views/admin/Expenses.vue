<template>
	<div>
		<v-card height="100vh">
			<v-container grid-list-md>
				<v-layout row wrap>
					<v-row no-gutters>
						<v-col cols="4">
							<v-flex xs12>
								<v-card>
									<v-card-title  class="d-flex justify-space-between">
										<span style="font-weight: 300">No. of Expenses</span>
										<span style="font-weight: 300">{{ getExpenses.length }}</span>
									</v-card-title>
								</v-card>
							</v-flex>
						</v-col>
            <v-spacer></v-spacer>
					</v-row>
				</v-layout>
        <v-layout row wrap class="mt-5">
					<v-row no-gutters>
						<v-col cols="12">
							<v-flex xs12>
								<v-data-table
									:headers="headers"
									:items="getExpenses"
									class="elevation-1"
								>
                  <template v-slot:item.created_at="{ item }">
                    {{ formatDate(item.created_at) }}
									</template>
                 <template v-slot:item.expenses="{ item }">
                    <v-btn @click="viewExpenditure(item.expenses)">view</v-btn>
									</template> 
								</v-data-table>
							</v-flex>
						</v-col>
					</v-row>
				</v-layout>
			</v-container>
		</v-card>
    <v-dialog v-model="showExpenditure" max-width="600">
      <v-card>
        <v-container>
          <v-list>
            <v-list-title>Store - Amount owed</v-list-title>
            <v-list-item
              v-for="(cost, storeId) in targetExpenditure"
              :key="storeId"
            >
              {{ getStoreName(storeId) }} ({{ storeId }}) - ${{ cost }}
            </v-list-item>
          </v-list>
        </v-container>
      </v-card>
    </v-dialog>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { formatDateShort } from '@/utils/dateTimeUtil';
export default {
  name: "Expenses",
  created () {
    this.initExpenses();
  },
  data () {
    return {
      headers: [
				{ 
					text: 'Date', 
					align: 'left', 
					value: 'created_at' 
				},
				{ 
					text: "Details", 
					align: 'left', 
					value: 'expenses' 
        },
      ],
      targetExpenditure: null,
      showExpenditure: false,
    }
  },
  computed: {
    ...mapGetters(["getExpenses", "getStores"])
  },
  methods: {
    ...mapActions(["initExpenses"]),
    viewExpenditure(expenditure) {
      this.targetExpenditure = expenditure;
      this.showExpenditure = true;
    },
    getStoreName(storeId) {
      return this.getStores.find(store => store.id == storeId).name;
    },
    formatDate(date) {
      return formatDateShort(date);
    }
  }
}
</script>

<style>

</style>