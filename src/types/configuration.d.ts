export interface SystemConfiguration {
  'reservation.timeout.minutes': string;
  'waitinglist.notification.hours': string;
  'system.maintenance.mode': string;
  'jwt.refresh.days': string;
  'reservation.penalty.days': string;
  'reservation.max.per.year': string;
  'jwt.access.minutes': string;
  'email.notifications.enabled': string;
}

export type ConfigurationKey = keyof SystemConfiguration;

export interface UpdateConfigurationRequest {
  value: string;
}

export interface ConfigurationMetadata {
  key: ConfigurationKey;
  label: string;
  description: string;
  type: 'number' | 'boolean';
  unit?: string;
}
