<template>
  <section class="page-home">
    <div class="page-home__content">
      <div class="calendar-controls">
        <Button icon="pi pi-chevron-left" class="p-button-rounded" @click="previousDay" />
        <div class="current-date">
          <h2>{{ formattedDate }}</h2>
          <div class="today-section">
            <Button label="Go to today" class="p-button-text" @click="goToToday" />
          </div>
        </div>
        <Button icon="pi pi-chevron-right" class="p-button-rounded" @click="nextDay" />
      </div>

      <div class="action-buttons">
        <Button label="Входящие" icon="pi pi-plus" class="p-button-success" @click="openInboundModal" />
        <Button label="Старший смены" icon="pi pi-plus" class="p-button-info" @click="openShiftLeadModal" />
        <Button label="Исходящие" icon="pi pi-plus" class="p-button-warning" @click="openOutboundModal" />
      </div>

      <div class="track-items-container">
        <ProgressSpinner v-if="loading" />
        <Message v-else-if="error" severity="error">
          {{ error }}
        </Message>
        <div v-else-if="!trackItems || trackItems.length === 0" class="no-items">
          <p>No track items for this day</p>
        </div>
        <div v-else class="track-items-list">
          <Card v-for="item in trackItems" :key="item.id" class="track-item-card">
            <template #content>
              <div class="track-item-content">
                <div class="track-item-header">
                  <Tag :value="getTypeLabel(item.type)" :severity="getTypeSeverity(item.type)" />
                  <Tag v-if="item.subtype" :value="getSubtypeLabel(item.subtype)" severity="secondary" />
                  <Tag v-if="item.inbound_rule" :value="`Стол ${item.inbound_rule}`" severity="secondary" />
                </div>
                <div class="track-item-details">
                  <div class="detail-item">
                    <i class="pi pi-clock" />
                    <span>{{ item.working_hours }} час</span>
                  </div>
                  <div class="detail-item">
                    <i class="pi pi-calendar" />
                    <span>{{ item.working_shifts.toFixed(2) }} смен(а)</span>
                  </div>
                  <div v-if="item.emergency_call" class="detail-item">
                    <i class="pi pi-exclamation-triangle" />
                    <span>Дежурство</span>
                  </div>
                  <div v-if="item.holiday_call" class="detail-item">
                    <i class="pi pi-star" />
                    <span>Праздник</span>
                  </div>
                </div>
                <div class="track-item-actions">
                  <Button icon="pi pi-trash" class="p-button-danger p-button-text" @click="deleteItem(item.id)" />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <ShiftModal
      v-model:visible="inboundModalVisible"
      v-model:form-data="inboundForm"
      modal-type="inbound"
      :submitting="submitting"
      @submit="submitInbound"
    />

    <ShiftModal
      v-model:visible="shiftLeadModalVisible"
      v-model:form-data="shiftLeadForm"
      modal-type="shiftlead"
      :submitting="submitting"
      @submit="submitShiftLead"
    />

    <ShiftModal
      v-model:visible="outboundModalVisible"
      v-model:form-data="outboundForm"
      modal-type="outbound"
      :submitting="submitting"
      @submit="submitOutbound"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import ShiftModal from './components/ShiftModal.vue'
import { useAuth } from '@/composables/useAuth'
import { api, InboundRule, OutboundSubtype, WorkType } from '@/services/api'
import type { CreateTrackItemData, TrackItem } from '@/types/api'

defineOptions({
  name: 'PageHome',
})

const auth = useAuth()

// Date management
const currentDate = ref(new Date())
const formattedDate = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const formatDateForSave = (date: Date): string => {
  return date.toISOString()
}
const formatDateForGet = (date: Date, shift = 0): string => {
  const _Date = new Date(date)
  _Date.setDate(_Date.getDate() + shift)
  return new Date(
    `${_Date.getFullYear().toString()}-${String(_Date.getMonth() + 1)}-${_Date.getDate().toString()}`
  ).toISOString()
}

const previousDay = () => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() - 1)
  currentDate.value = newDate
}

const nextDay = () => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() + 1)
  currentDate.value = newDate
}

const goToToday = () => {
  currentDate.value = new Date()
}

// Track items management
const trackItems = ref<TrackItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchTrackItems = async () => {
  if (!auth.authToken.value) return

  loading.value = true
  error.value = null

  try {
    const dateFrom = formatDateForGet(currentDate.value)
    const dateTo = formatDateForGet(currentDate.value, 1)
    trackItems.value = await api.getTrackItems(auth.authToken.value, {
      start_date: dateFrom,
      end_date: dateTo,
    })
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch track items'
  } finally {
    loading.value = false
  }
}

watch(currentDate, () => {
  void fetchTrackItems()
})

onMounted(() => {
  void fetchTrackItems()
})

// Modal states
const inboundModalVisible = ref(false)
const shiftLeadModalVisible = ref(false)
const outboundModalVisible = ref(false)
const submitting = ref(false)

// Form data
const inboundForm = ref({
  inbound_rule: null as InboundRule | null,
  working_shifts: 1,
  emergency_call: false,
  holiday_call: false,
})

const shiftLeadForm = ref({
  working_shifts: 1,
  emergency_call: false,
  holiday_call: false,
})

const outboundForm = ref({
  subtype: null as OutboundSubtype | null,
  working_hours: 6,
  working_shifts: 1,
  emergency_call: false,
  holiday_call: false,
})

// Modal handlers
const openInboundModal = () => {
  inboundForm.value = {
    inbound_rule: null,
    working_shifts: 1,
    emergency_call: false,
    holiday_call: false,
  }
  inboundModalVisible.value = true
}

const openShiftLeadModal = () => {
  shiftLeadForm.value = {
    working_shifts: 1,
    emergency_call: false,
    holiday_call: false,
  }
  shiftLeadModalVisible.value = true
}

const openOutboundModal = () => {
  outboundForm.value = {
    subtype: null,
    working_hours: 6,
    working_shifts: 1,
    emergency_call: false,
    holiday_call: false,
  }
  outboundModalVisible.value = true
}

// Submit handlers
const submitInbound = async () => {
  if (!auth.authToken.value || !inboundForm.value.inbound_rule) return

  submitting.value = true

  try {
    const data: CreateTrackItemData = {
      type: WorkType.INBOUND,
      inbound_rule: inboundForm.value.inbound_rule,
      emergency_call: inboundForm.value.emergency_call,
      holiday_call: inboundForm.value.holiday_call,
      working_hours: 0,
      working_shifts: inboundForm.value.working_shifts,
      date: formatDateForSave(currentDate.value),
    }

    await api.createTrackItem(auth.authToken.value, data)
    inboundModalVisible.value = false
    await fetchTrackItems()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to create track item'
  } finally {
    submitting.value = false
  }
}

const submitShiftLead = async () => {
  if (!auth.authToken.value) return

  submitting.value = true

  try {
    const data: CreateTrackItemData = {
      type: WorkType.SHIFT_LEAD,
      emergency_call: shiftLeadForm.value.emergency_call,
      holiday_call: shiftLeadForm.value.holiday_call,
      working_hours: 8 * shiftLeadForm.value.working_shifts,
      working_shifts: shiftLeadForm.value.working_shifts,
      date: formatDateForSave(currentDate.value),
    }

    await api.createTrackItem(auth.authToken.value, data)
    shiftLeadModalVisible.value = false
    await fetchTrackItems()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to create track item'
  } finally {
    submitting.value = false
  }
}

const submitOutbound = async () => {
  if (!auth.authToken.value || !outboundForm.value.subtype) return

  submitting.value = true

  try {
    const data: CreateTrackItemData = {
      type: WorkType.OUTBOUND,
      subtype: outboundForm.value.subtype,
      emergency_call: outboundForm.value.emergency_call,
      holiday_call: outboundForm.value.holiday_call,
      working_hours: outboundForm.value.working_hours,
      working_shifts: outboundForm.value.working_shifts,
      date: formatDateForSave(currentDate.value),
    }

    await api.createTrackItem(auth.authToken.value, data)
    outboundModalVisible.value = false
    await fetchTrackItems()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to create track item'
  } finally {
    submitting.value = false
  }
}

// Delete handler
const deleteItem = async (id: number) => {
  if (!auth.authToken.value) return

  try {
    await api.deleteTrackItem(auth.authToken.value, id)
    await fetchTrackItems()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to delete track item'
  }
}

// Helper functions for display
const getTypeLabel = (type: WorkType): string => {
  switch (type) {
    case WorkType.SHIFT_LEAD:
      return 'Старший смены'
    case WorkType.INBOUND:
      return 'Входящие'
    case WorkType.OUTBOUND:
      return 'Исходящие'
    default:
      return type
  }
}

const getTypeSeverity = (type: WorkType): string => {
  switch (type) {
    case WorkType.SHIFT_LEAD:
      return 'info'
    case WorkType.INBOUND:
      return 'success'
    case WorkType.OUTBOUND:
      return 'warning'
    default:
      return 'secondary'
  }
}

const getSubtypeLabel = (subtype: OutboundSubtype): string => {
  switch (subtype) {
    case OutboundSubtype.REGULAR:
      return 'Подтверждение приемов'
    case OutboundSubtype.EXTRA:
      return 'Доп. смена'
    default:
      return subtype
  }
}
</script>

<style scoped lang="scss">
.page-home {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  //min-height: 100%;
  //padding-bottom: 32px;

  &__content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 0 32px;
  }
}

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border: 1px solid var(--panel-border);
  border-radius: 16px;
  box-shadow: var(--panel-shadow);

  .current-date {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    .today-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;

      .short-date {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.track-items-container {
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;

  .no-items {
    text-align: center;
    color: var(--palette-gray);
    font-size: 16px;
  }

  .track-items-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .track-item-card {
      .track-item-content {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .track-item-header {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .track-item-details {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;

          .detail-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-secondary);

            i {
              color: var(--palette-gray);
            }
          }
        }

        .track-item-actions {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>
