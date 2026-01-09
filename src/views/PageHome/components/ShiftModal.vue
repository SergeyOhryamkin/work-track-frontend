<template>
  <Dialog v-model:visible="isVisible" :header="modalTitle" :modal="true" :style="{ width: '450px' }">
    <div class="modal-content">
      <div v-if="modalType === 'inbound'" class="field">
        <label for="inbound-rule">Стол *</label>
        <Select
          id="inbound-rule"
          :model-value="formData.inbound_rule"
          :options="inboundRules"
          option-label="label"
          option-value="value"
          placeholder="Выберете стол"
          class="w-full"
          @update:model-value="(value) => emit('update:formData', { ...formData, inbound_rule: value })"
        />
      </div>

      <div v-if="modalType === 'outbound'" class="field">
        <label for="outbound-subtype">Тпи *</label>
        <Select
          id="outbound-subtype"
          :model-value="formData.subtype"
          :options="outboundSubtypes"
          option-label="label"
          option-value="value"
          placeholder="Выберете тип"
          class="w-full"
          @update:model-value="(value) => emit('update:formData', { ...formData, subtype: value })"
        />
      </div>

      <div v-if="modalType === 'outbound'" class="field">
        <label for="outbound-hours">Часы работы *</label>
        <InputNumber
          id="outbound-hours"
          :model-value="formData.working_hours"
          :min="0.5"
          :max="24"
          :step="0.5"
          show-buttons
          class="w-full"
          @update:model-value="(value) => emit('update:formData', { ...formData, working_hours: value })"
        />
      </div>

      <div class="field">
        <label :for="`${modalType}-emergency`">Дежурство</label>
        <Checkbox
          :id="`${modalType}-emergency`"
          :model-value="formData.emergency_call"
          :binary="true"
          @update:model-value="(value) => emit('update:formData', { ...formData, emergency_call: value })"
        />
      </div>

      <div class="field">
        <label :for="`${modalType}-holiday`">Праздничная смена</label>
        <Checkbox
          :id="`${modalType}-holiday`"
          :model-value="formData.holiday_call"
          :binary="true"
          @update:model-value="(value) => emit('update:formData', { ...formData, holiday_call: value })"
        />
      </div>

      <p v-if="modalType === 'shiftlead'" class="info-text">
        <i class="pi pi-info-circle" /> Shift Lead is fixed at 8 hours per shift
      </p>
    </div>
    <template #footer>
      <Button label="Отмена" icon="pi pi-times" class="p-button-text" @click="handleCancel" />
      <Button label="Добавить" icon="pi pi-check" :loading="submitting" @click="handleSubmit" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { InboundRule, OutboundSubtype } from '@/services/api'

interface ShiftModalProps {
  visible: boolean
  modalType: 'inbound' | 'shiftlead' | 'outbound'
  formData: {
    inbound_rule?: InboundRule | null
    subtype?: OutboundSubtype | null
    working_hours?: number
    working_shifts: number
    emergency_call: boolean
    holiday_call: boolean
  }
  submitting: boolean
}

interface ShiftModalEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:formData', value: ShiftModalProps['formData']): void
  (e: 'submit'): void
}

const props = defineProps<ShiftModalProps>()
const emit = defineEmits<ShiftModalEmits>()

const isVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => {
    emit('update:visible', value)
  },
})

const modalTitle = computed(() => {
  switch (props.modalType) {
    case 'inbound':
      return 'Add Inbound'
    case 'shiftlead':
      return 'Add Shift Lead'
    case 'outbound':
      return 'Add Outbound'
    default:
      return 'Add Shift'
  }
})

const inboundRules = [
  { label: 'Стол 101', value: InboundRule.RULE_101 },
  { label: 'Стол 102', value: InboundRule.RULE_102 },
  { label: 'Стол 103', value: InboundRule.RULE_103 },
  { label: 'Стол 104', value: InboundRule.RULE_104 },
  { label: 'Стол 105', value: InboundRule.RULE_105 },
  { label: 'Стол 106', value: InboundRule.RULE_106 },
  { label: 'Стол 107', value: InboundRule.RULE_107 },
]

const outboundSubtypes = [
  { label: 'ПП', value: OutboundSubtype.REGULAR },
  { label: 'Доп. смена', value: OutboundSubtype.EXTRA },
]

const handleCancel = () => {
  emit('update:visible', false)
}

const handleSubmit = () => {
  emit('submit')
}
</script>

<style scoped lang="scss">
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  .info-text {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--palette-gray);
    font-size: 14px;
    margin: 0;

    i {
      color: #0d6efd;
    }
  }
}

.w-full {
  width: 100%;
}
</style>
