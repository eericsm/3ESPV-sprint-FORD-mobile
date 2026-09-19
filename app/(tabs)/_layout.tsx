import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#1261A0',
                tabBarInactiveTintColor: '#6B8194',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopColor: '#D7E1E8',
                },
            }}
        >
            <Tabs.Screen name="portal" options={{ title: 'Portal', tabBarIcon: ({ color, size }) => <Ionicons name="sparkles" color={color} size={size} /> }} />
            <Tabs.Screen name="modelos" options={{ title: 'Modelos', tabBarIcon: ({ color, size }) => <Ionicons name="car-sport" color={color} size={size} /> }} />
            <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" color={color} size={size} /> }} />
            <Tabs.Screen name="concessionarias" options={{ title: 'Lojas', tabBarIcon: ({ color, size }) => <Ionicons name="map" color={color} size={size} /> }} />
            <Tabs.Screen name="agendamentos" options={{ title: 'Agenda', tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} /> }} />
            <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} /> }} />
        </Tabs>
    );
}
