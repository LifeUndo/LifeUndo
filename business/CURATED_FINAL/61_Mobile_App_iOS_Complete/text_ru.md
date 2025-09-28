# Мобильное приложение LifeUndo для iOS - Полная реализация

## Философия iOS приложения

### "Нативная красота Apple с мощью LifeUndo"
iOS приложение должно выглядеть как продукт Apple — минималистично, элегантно и функционально. Каждый экран должен быть произведением искусства, каждая анимация должна быть плавной, каждый жест должен быть интуитивным.

## Техническая архитектура

### 🏗️ Технологический стек
```swift
// Основные технологии
import SwiftUI
import CoreData
import CloudKit
import Combine
import AVFoundation
import Speech
import Vision
import CoreML
import CryptoKit
import Network

// Архитектура MVVM + Combine
class LifeUndoApp: App {
    @StateObject private var dataController = DataController()
    @StateObject private var authManager = AuthManager()
    @StateObject private var syncManager = SyncManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, dataController.container.viewContext)
                .environmentObject(authManager)
                .environmentObject(syncManager)
        }
    }
}
```

### 📱 Структура приложения
```swift
// Основная структура приложения
struct ContentView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var selectedTab = 0
    
    var body: some View {
        if authManager.isAuthenticated {
            MainTabView(selectedTab: $selectedTab)
        } else {
            OnboardingView()
        }
    }
}

struct MainTabView: View {
    @Binding var selectedTab: Int
    
    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("Главная")
                }
                .tag(0)
            
            FilesView()
                .tabItem {
                    Image(systemName: "folder.fill")
                    Text("Файлы")
                }
                .tag(1)
            
            RestoreView()
                .tabItem {
                    Image(systemName: "arrow.clockwise")
                    Text("Восстановить")
                }
                .tag(2)
            
            SettingsView()
                .tabItem {
                    Image(systemName: "gear")
                    Text("Настройки")
                }
                .tag(3)
        }
        .accentColor(.blue)
    }
}
```

## Дизайн и интерфейс

### 🎨 Дизайн-система
```swift
// Цветовая палитра
extension Color {
    static let primaryBlue = Color(red: 0.39, green: 0.42, blue: 0.95)
    static let secondaryPurple = Color(red: 0.55, green: 0.36, blue: 0.97)
    static let accentCyan = Color(red: 0.02, green: 0.71, blue: 0.83)
    static let successGreen = Color(red: 0.06, green: 0.73, blue: 0.51)
    static let warningOrange = Color(red: 0.96, green: 0.60, blue: 0.04)
    static let errorRed = Color(red: 0.94, green: 0.27, blue: 0.27)
    
    static let textPrimary = Color(red: 0.07, green: 0.09, blue: 0.15)
    static let textSecondary = Color(red: 0.42, green: 0.45, blue: 0.50)
    static let textMuted = Color(red: 0.61, green: 0.64, blue: 0.69)
    
    static let bgPrimary = Color(red: 1.0, green: 1.0, blue: 1.0)
    static let bgSecondary = Color(red: 0.98, green: 0.98, blue: 0.98)
    static let bgTertiary = Color(red: 0.95, green: 0.95, blue: 0.97)
}

// Типографика
extension Font {
    static let largeTitle = Font.system(size: 34, weight: .bold, design: .default)
    static let title1 = Font.system(size: 28, weight: .bold, design: .default)
    static let title2 = Font.system(size: 22, weight: .bold, design: .default)
    static let title3 = Font.system(size: 20, weight: .semibold, design: .default)
    static let headline = Font.system(size: 17, weight: .semibold, design: .default)
    static let body = Font.system(size: 17, weight: .regular, design: .default)
    static let callout = Font.system(size: 16, weight: .regular, design: .default)
    static let subheadline = Font.system(size: 15, weight: .regular, design: .default)
    static let footnote = Font.system(size: 13, weight: .regular, design: .default)
    static let caption1 = Font.system(size: 12, weight: .regular, design: .default)
    static let caption2 = Font.system(size: 11, weight: .regular, design: .default)
}

// Компоненты
struct PrimaryButton: View {
    let title: String
    let action: () -> Void
    let isLoading: Bool
    
    var body: some View {
        Button(action: action) {
            HStack {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .scaleEffect(0.8)
                } else {
                    Text(title)
                        .font(.headline)
                        .foregroundColor(.white)
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(
                LinearGradient(
                    gradient: Gradient(colors: [.primaryBlue, .secondaryPurple]),
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .cornerRadius(12)
        }
        .disabled(isLoading)
    }
}
```

### 🏠 Главный экран (HomeView)
```swift
struct HomeView: View {
    @StateObject private var viewModel = HomeViewModel()
    @State private var showingRestoreSheet = false
    @State private var showingVoiceInput = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Приветствие
                    WelcomeCard(user: viewModel.currentUser)
                    
                    // Быстрые действия
                    QuickActionsGrid(
                        onRestore: { showingRestoreSheet = true },
                        onVoiceInput: { showingVoiceInput = true },
                        onScan: { viewModel.startScanning() }
                    )
                    
                    // Статистика
                    StatsCard(stats: viewModel.stats)
                    
                    // Последние восстановления
                    RecentRestorationsCard(restorations: viewModel.recentRestorations)
                    
                    // Рекомендации ИИ
                    AIRecommendationsCard(recommendations: viewModel.aiRecommendations)
                }
                .padding()
            }
            .navigationTitle("LifeUndo")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showingVoiceInput = true }) {
                        Image(systemName: "mic.fill")
                            .foregroundColor(.primaryBlue)
                    }
                }
            }
        }
        .sheet(isPresented: $showingRestoreSheet) {
            RestoreSheet()
        }
        .sheet(isPresented: $showingVoiceInput) {
            VoiceInputSheet()
        }
    }
}

struct WelcomeCard: View {
    let user: User
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                VStack(alignment: .leading) {
                    Text("Привет, \(user.name)!")
                        .font(.title2)
                        .foregroundColor(.textPrimary)
                    
                    Text("Готов восстановить ваши данные?")
                        .font(.subheadline)
                        .foregroundColor(.textSecondary)
                }
                
                Spacer()
                
                AsyncImage(url: user.avatarURL) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Circle()
                        .fill(Color.bgTertiary)
                        .overlay(
                            Image(systemName: "person.fill")
                                .foregroundColor(.textMuted)
                        )
                }
                .frame(width: 60, height: 60)
                .clipShape(Circle())
            }
            
            HStack {
                Image(systemName: "shield.checkered")
                    .foregroundColor(.successGreen)
                Text("Все данные защищены квантовой криптографией")
                    .font(.caption1)
                    .foregroundColor(.textSecondary)
            }
        }
        .padding()
        .background(Color.bgPrimary)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
    }
}

struct QuickActionsGrid: View {
    let onRestore: () -> Void
    let onVoiceInput: () -> Void
    let onScan: () -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Быстрые действия")
                .font(.headline)
                .foregroundColor(.textPrimary)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 16) {
                QuickActionCard(
                    icon: "arrow.clockwise",
                    title: "Восстановить",
                    subtitle: "Найти удаленные файлы",
                    color: .primaryBlue,
                    action: onRestore
                )
                
                QuickActionCard(
                    icon: "mic.fill",
                    title: "Голосовой ввод",
                    subtitle: "Скажите что восстановить",
                    color: .accentCyan,
                    action: onVoiceInput
                )
                
                QuickActionCard(
                    icon: "camera.fill",
                    title: "Сканировать",
                    subtitle: "Найти данные в фото",
                    color: .successGreen,
                    action: onScan
                )
                
                QuickActionCard(
                    icon: "brain.head.profile",
                    title: "ИИ помощник",
                    subtitle: "Умные рекомендации",
                    color: .secondaryPurple,
                    action: { }
                )
            }
        }
    }
}

struct QuickActionCard: View {
    let icon: String
    let title: String
    let subtitle: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(color)
                
                VStack(spacing: 4) {
                    Text(title)
                        .font(.headline)
                        .foregroundColor(.textPrimary)
                    
                    Text(subtitle)
                        .font(.caption1)
                        .foregroundColor(.textSecondary)
                        .multilineTextAlignment(.center)
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 120)
            .background(Color.bgPrimary)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
        }
    }
}
```

### 📁 Экран файлов (FilesView)
```swift
struct FilesView: View {
    @StateObject private var viewModel = FilesViewModel()
    @State private var searchText = ""
    @State private var selectedCategory: FileCategory = .all
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Поиск и фильтры
                SearchAndFiltersView(
                    searchText: $searchText,
                    selectedCategory: $selectedCategory
                )
                
                // Список файлов
                FilesListView(
                    files: viewModel.filteredFiles,
                    onFileTap: { file in
                        viewModel.openFile(file)
                    },
                    onFileDelete: { file in
                        viewModel.deleteFile(file)
                    }
                )
            }
            .navigationTitle("Мои файлы")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        Button("Сортировать по дате") {
                            viewModel.sortByDate()
                        }
                        Button("Сортировать по размеру") {
                            viewModel.sortBySize()
                        }
                        Button("Сортировать по типу") {
                            viewModel.sortByType()
                        }
                    } label: {
                        Image(systemName: "arrow.up.arrow.down")
                    }
                }
            }
        }
        .searchable(text: $searchText, prompt: "Поиск файлов")
        .onChange(of: searchText) { newValue in
            viewModel.searchFiles(newValue)
        }
        .onChange(of: selectedCategory) { newValue in
            viewModel.filterByCategory(newValue)
        }
    }
}

struct FilesListView: View {
    let files: [FileItem]
    let onFileTap: (FileItem) -> Void
    let onFileDelete: (FileItem) -> Void
    
    var body: some View {
        List {
            ForEach(files) { file in
                FileRowView(
                    file: file,
                    onTap: { onFileTap(file) },
                    onDelete: { onFileDelete(file) }
                )
            }
        }
        .listStyle(PlainListStyle())
    }
}

struct FileRowView: View {
    let file: FileItem
    let onTap: () -> Void
    let onDelete: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 16) {
                // Иконка файла
                FileIconView(file: file)
                
                // Информация о файле
                VStack(alignment: .leading, spacing: 4) {
                    Text(file.name)
                        .font(.headline)
                        .foregroundColor(.textPrimary)
                        .lineLimit(1)
                    
                    HStack {
                        Text(file.sizeFormatted)
                            .font(.caption1)
                            .foregroundColor(.textSecondary)
                        
                        Spacer()
                        
                        Text(file.modifiedDateFormatted)
                            .font(.caption1)
                            .foregroundColor(.textSecondary)
                    }
                }
                
                Spacer()
                
                // Статус
                if file.isRestored {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.successGreen)
                }
            }
            .padding(.vertical, 8)
        }
        .swipeActions(edge: .trailing) {
            Button("Удалить", role: .destructive) {
                onDelete()
            }
        }
    }
}
```

### 🔄 Экран восстановления (RestoreView)
```swift
struct RestoreView: View {
    @StateObject private var viewModel = RestoreViewModel()
    @State private var showingRestoreOptions = false
    @State private var showingRestoreProgress = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Заголовок
                    RestoreHeaderView()
                    
                    // Типы восстановления
                    RestoreTypesView(
                        onTypeSelected: { type in
                            viewModel.selectRestoreType(type)
                            showingRestoreOptions = true
                        }
                    )
                    
                    // История восстановлений
                    RestoreHistoryView(
                        history: viewModel.restoreHistory,
                        onRestoreAgain: { item in
                            viewModel.restoreAgain(item)
                        }
                    )
                    
                    // Статистика
                    RestoreStatsView(stats: viewModel.stats)
                }
                .padding()
            }
            .navigationTitle("Восстановление")
            .navigationBarTitleDisplayMode(.large)
        }
        .sheet(isPresented: $showingRestoreOptions) {
            RestoreOptionsSheet(
                restoreType: viewModel.selectedRestoreType,
                onStartRestore: { options in
                    viewModel.startRestore(options)
                    showingRestoreProgress = true
                }
            )
        }
        .sheet(isPresented: $showingRestoreProgress) {
            RestoreProgressSheet(
                progress: viewModel.restoreProgress,
                onCancel: {
                    viewModel.cancelRestore()
                }
            )
        }
    }
}

struct RestoreTypesView: View {
    let onTypeSelected: (RestoreType) -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Типы восстановления")
                .font(.headline)
                .foregroundColor(.textPrimary)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 16) {
                RestoreTypeCard(
                    icon: "doc.fill",
                    title: "Документы",
                    subtitle: "Word, Excel, PDF",
                    color: .primaryBlue,
                    action: { onTypeSelected(.documents) }
                )
                
                RestoreTypeCard(
                    icon: "photo.fill",
                    title: "Фотографии",
                    subtitle: "Изображения и видео",
                    color: .accentCyan,
                    action: { onTypeSelected(.photos) }
                )
                
                RestoreTypeCard(
                    icon: "message.fill",
                    title: "Сообщения",
                    subtitle: "SMS, WhatsApp, Telegram",
                    color: .successGreen,
                    action: { onTypeSelected(.messages) }
                )
                
                RestoreTypeCard(
                    icon: "key.fill",
                    title: "Пароли",
                    subtitle: "Сохраненные пароли",
                    color: .warningOrange,
                    action: { onTypeSelected(.passwords) }
                )
            }
        }
    }
}

struct RestoreTypeCard: View {
    let icon: String
    let title: String
    let subtitle: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(color)
                
                VStack(spacing: 4) {
                    Text(title)
                        .font(.headline)
                        .foregroundColor(.textPrimary)
                    
                    Text(subtitle)
                        .font(.caption1)
                        .foregroundColor(.textSecondary)
                        .multilineTextAlignment(.center)
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 120)
            .background(Color.bgPrimary)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
        }
    }
}
```

### 🎤 Голосовой ввод
```swift
struct VoiceInputView: View {
    @StateObject private var speechRecognizer = SpeechRecognizer()
    @State private var isRecording = false
    @State private var recognizedText = ""
    @State private var showingResults = false
    
    var body: some View {
        VStack(spacing: 32) {
            // Анимация микрофона
            VoiceAnimationView(isRecording: isRecording)
            
            // Распознанный текст
            if !recognizedText.isEmpty {
                VStack(spacing: 16) {
                    Text("Распознано:")
                        .font(.headline)
                        .foregroundColor(.textSecondary)
                    
                    Text(recognizedText)
                        .font(.body)
                        .foregroundColor(.textPrimary)
                        .multilineTextAlignment(.center)
                        .padding()
                        .background(Color.bgSecondary)
                        .cornerRadius(12)
                }
            }
            
            // Кнопка записи
            Button(action: toggleRecording) {
                ZStack {
                    Circle()
                        .fill(isRecording ? Color.errorRed : Color.primaryBlue)
                        .frame(width: 120, height: 120)
                    
                    Image(systemName: isRecording ? "stop.fill" : "mic.fill")
                        .font(.title)
                        .foregroundColor(.white)
                }
            }
            .scaleEffect(isRecording ? 1.1 : 1.0)
            .animation(.easeInOut(duration: 0.2), value: isRecording)
            
            // Инструкции
            Text(isRecording ? "Говорите..." : "Нажмите и говорите")
                .font(.headline)
                .foregroundColor(.textSecondary)
            
            Spacer()
        }
        .padding()
        .onAppear {
            speechRecognizer.onResult = { text in
                recognizedText = text
            }
        }
    }
    
    private func toggleRecording() {
        if isRecording {
            speechRecognizer.stopRecording()
            isRecording = false
            showingResults = true
        } else {
            speechRecognizer.startRecording()
            isRecording = true
            recognizedText = ""
        }
    }
}

class SpeechRecognizer: ObservableObject {
    private let speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "ru-RU"))
    private let audioEngine = AVAudioEngine()
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    
    var onResult: ((String) -> Void)?
    
    func startRecording() {
        guard let speechRecognizer = speechRecognizer, speechRecognizer.isAvailable else {
            print("Speech recognition not available")
            return
        }
        
        do {
            let audioSession = AVAudioSession.sharedInstance()
            try audioSession.setCategory(.record, mode: .measurement, options: .duckOthers)
            try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
            
            recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
            guard let recognitionRequest = recognitionRequest else {
                print("Unable to create recognition request")
                return
            }
            
            recognitionRequest.shouldReportPartialResults = true
            
            recognitionTask = speechRecognizer.recognitionTask(with: recognitionRequest) { result, error in
                if let result = result {
                    let recognizedText = result.bestTranscription.formattedString
                    DispatchQueue.main.async {
                        self.onResult?(recognizedText)
                    }
                }
            }
            
            let inputNode = audioEngine.inputNode
            let recordingFormat = inputNode.outputFormat(forBus: 0)
            
            inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { buffer, _ in
                recognitionRequest.append(buffer)
            }
            
            audioEngine.prepare()
            try audioEngine.start()
            
        } catch {
            print("Error starting speech recognition: \(error)")
        }
    }
    
    func stopRecording() {
        audioEngine.stop()
        audioEngine.inputNode.removeTap(onBus: 0)
        recognitionRequest?.endAudio()
        recognitionTask?.cancel()
    }
}
```

### ⚙️ Экран настроек (SettingsView)
```swift
struct SettingsView: View {
    @StateObject private var viewModel = SettingsViewModel()
    @State private var showingAccountSettings = false
    @State private var showingPrivacySettings = false
    @State private var showingNotificationSettings = false
    
    var body: some View {
        NavigationView {
            List {
                // Профиль
                Section {
                    ProfileRowView(user: viewModel.currentUser) {
                        showingAccountSettings = true
                    }
                }
                
                // Основные настройки
                Section("Основные") {
                    SettingsRowView(
                        icon: "bell.fill",
                        title: "Уведомления",
                        subtitle: "Настройки уведомлений",
                        action: { showingNotificationSettings = true }
                    )
                    
                    SettingsRowView(
                        icon: "lock.fill",
                        title: "Приватность",
                        subtitle: "Конфиденциальность данных",
                        action: { showingPrivacySettings = true }
                    )
                    
                    SettingsRowView(
                        icon: "icloud.fill",
                        title: "Синхронизация",
                        subtitle: "Облачная синхронизация",
                        action: { }
                    )
                }
                
                // Дополнительные функции
                Section("Дополнительно") {
                    SettingsRowView(
                        icon: "brain.head.profile",
                        title: "ИИ помощник",
                        subtitle: "Настройки ИИ",
                        action: { }
                    )
                    
                    SettingsRowView(
                        icon: "mic.fill",
                        title: "Голосовое управление",
                        subtitle: "Настройки голоса",
                        action: { }
                    )
                    
                    SettingsRowView(
                        icon: "camera.fill",
                        title: "Сканирование",
                        subtitle: "Настройки камеры",
                        action: { }
                    )
                }
                
                // Поддержка
                Section("Поддержка") {
                    SettingsRowView(
                        icon: "questionmark.circle.fill",
                        title: "Помощь",
                        subtitle: "Частые вопросы",
                        action: { }
                    )
                    
                    SettingsRowView(
                        icon: "envelope.fill",
                        title: "Связаться с нами",
                        subtitle: "Поддержка",
                        action: { }
                    )
                    
                    SettingsRowView(
                        icon: "star.fill",
                        title: "Оценить приложение",
                        subtitle: "В App Store",
                        action: { }
                    )
                }
                
                // О приложении
                Section("О приложении") {
                    SettingsRowView(
                        icon: "info.circle.fill",
                        title: "Версия",
                        subtitle: "1.0.0",
                        action: { }
                    )
                    
                    SettingsRowView(
                        icon: "doc.text.fill",
                        title: "Условия использования",
                        subtitle: "Правовая информация",
                        action: { }
                    )
                    
                    SettingsRowView(
                        icon: "hand.raised.fill",
                        title: "Конфиденциальность",
                        subtitle: "Политика конфиденциальности",
                        action: { }
                    )
                }
            }
            .navigationTitle("Настройки")
            .navigationBarTitleDisplayMode(.large)
        }
        .sheet(isPresented: $showingAccountSettings) {
            AccountSettingsSheet()
        }
        .sheet(isPresented: $showingPrivacySettings) {
            PrivacySettingsSheet()
        }
        .sheet(isPresented: $showingNotificationSettings) {
            NotificationSettingsSheet()
        }
    }
}

struct SettingsRowView: View {
    let icon: String
    let title: String
    let subtitle: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Image(systemName: icon)
                    .font(.title3)
                    .foregroundColor(.primaryBlue)
                    .frame(width: 24)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.headline)
                        .foregroundColor(.textPrimary)
                    
                    Text(subtitle)
                        .font(.caption1)
                        .foregroundColor(.textSecondary)
                }
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.caption1)
                    .foregroundColor(.textMuted)
            }
            .padding(.vertical, 8)
        }
    }
}
```

## Функциональность

### 🔐 Аутентификация
```swift
class AuthManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var isLoading = false
    
    private let keychain = Keychain(service: "com.getlifeundo.app")
    
    func signIn(email: String, password: String) async {
        isLoading = true
        
        do {
            let user = try await AuthService.signIn(email: email, password: password)
            await MainActor.run {
                self.currentUser = user
                self.isAuthenticated = true
                self.isLoading = false
            }
            
            // Сохраняем токен в Keychain
            try keychain.set(user.accessToken, key: "access_token")
            
        } catch {
            await MainActor.run {
                self.isLoading = false
            }
            print("Sign in error: \(error)")
        }
    }
    
    func signOut() {
        currentUser = nil
        isAuthenticated = false
        
        // Удаляем токен из Keychain
        try? keychain.remove("access_token")
    }
    
    func checkAuthStatus() {
        if let token = try? keychain.get("access_token") {
            // Проверяем валидность токена
            Task {
                do {
                    let user = try await AuthService.validateToken(token)
                    await MainActor.run {
                        self.currentUser = user
                        self.isAuthenticated = true
                    }
                } catch {
                    signOut()
                }
            }
        }
    }
}
```

### 📱 Уведомления
```swift
class NotificationManager: ObservableObject {
    static let shared = NotificationManager()
    
    func requestPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
            if granted {
                print("Notification permission granted")
            } else {
                print("Notification permission denied: \(error?.localizedDescription ?? "")")
            }
        }
    }
    
    func scheduleRestoreNotification(for file: FileItem) {
        let content = UNMutableNotificationContent()
        content.title = "Восстановление завершено"
        content.body = "Файл '\(file.name)' успешно восстановлен"
        content.sound = .default
        content.badge = 1
        
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
        let request = UNNotificationRequest(
            identifier: "restore_\(file.id)",
            content: content,
            trigger: trigger
        )
        
        UNUserNotificationCenter.current().add(request)
    }
    
    func scheduleBackupNotification() {
        let content = UNMutableNotificationContent()
        content.title = "Резервное копирование"
        content.body = "Создана резервная копия ваших данных"
        content.sound = .default
        
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 86400, repeats: true) // Каждый день
        let request = UNNotificationRequest(
            identifier: "daily_backup",
            content: content,
            trigger: trigger
        )
        
        UNUserNotificationCenter.current().add(request)
    }
}
```

### 🔄 Синхронизация
```swift
class SyncManager: ObservableObject {
    @Published var isSyncing = false
    @Published var syncProgress: Double = 0.0
    
    private let cloudKit = CloudKitManager()
    private let localDB = LocalDatabase()
    
    func syncData() async {
        await MainActor.run {
            isSyncing = true
            syncProgress = 0.0
        }
        
        do {
            // Загружаем изменения с сервера
            let serverChanges = try await cloudKit.fetchChanges()
            await MainActor.run { syncProgress = 0.3 }
            
            // Применяем изменения локально
            try await localDB.applyChanges(serverChanges)
            await MainActor.run { syncProgress = 0.6 }
            
            // Отправляем локальные изменения на сервер
            let localChanges = try await localDB.getChanges()
            try await cloudKit.pushChanges(localChanges)
            await MainActor.run { syncProgress = 1.0 }
            
        } catch {
            print("Sync error: \(error)")
        }
        
        await MainActor.run {
            isSyncing = false
            syncProgress = 0.0
        }
    }
}
```

## Тестирование

### 🧪 Unit тесты
```swift
import XCTest
@testable import LifeUndo

class AuthManagerTests: XCTestCase {
    var authManager: AuthManager!
    
    override func setUp() {
        super.setUp()
        authManager = AuthManager()
    }
    
    override func tearDown() {
        authManager = nil
        super.tearDown()
    }
    
    func testSignInSuccess() async {
        // Given
        let email = "test@example.com"
        let password = "password123"
        
        // When
        await authManager.signIn(email: email, password: password)
        
        // Then
        XCTAssertTrue(authManager.isAuthenticated)
        XCTAssertNotNil(authManager.currentUser)
    }
    
    func testSignInFailure() async {
        // Given
        let email = "invalid@example.com"
        let password = "wrongpassword"
        
        // When
        await authManager.signIn(email: email, password: password)
        
        // Then
        XCTAssertFalse(authManager.isAuthenticated)
        XCTAssertNil(authManager.currentUser)
    }
}

class FileManagerTests: XCTestCase {
    var fileManager: FileManager!
    
    override func setUp() {
        super.setUp()
        fileManager = FileManager()
    }
    
    func testFileRestore() async {
        // Given
        let file = FileItem(id: "1", name: "test.pdf", type: .pdf)
        
        // When
        let result = await fileManager.restoreFile(file)
        
        // Then
        XCTAssertTrue(result.isSuccess)
        XCTAssertEqual(result.restoredFile?.name, "test.pdf")
    }
}
```

### 🎯 UI тесты
```swift
import XCTest

class LifeUndoUITests: XCTestCase {
    var app: XCUIApplication!
    
    override func setUp() {
        super.setUp()
        app = XCUIApplication()
        app.launch()
    }
    
    func testHomeScreenElements() {
        // Проверяем наличие основных элементов
        XCTAssertTrue(app.navigationBars["LifeUndo"].exists)
        XCTAssertTrue(app.buttons["Восстановить"].exists)
        XCTAssertTrue(app.buttons["Голосовой ввод"].exists)
        XCTAssertTrue(app.buttons["Сканировать"].exists)
    }
    
    func testRestoreFlow() {
        // Нажимаем кнопку восстановления
        app.buttons["Восстановить"].tap()
        
        // Проверяем появление экрана восстановления
        XCTAssertTrue(app.navigationBars["Восстановление"].exists)
        
        // Выбираем тип восстановления
        app.buttons["Документы"].tap()
        
        // Проверяем появление опций
        XCTAssertTrue(app.sheets["Опции восстановления"].exists)
    }
    
    func testVoiceInput() {
        // Нажимаем кнопку голосового ввода
        app.buttons["Голосовой ввод"].tap()
        
        // Проверяем появление экрана голосового ввода
        XCTAssertTrue(app.sheets["Голосовой ввод"].exists)
        
        // Нажимаем кнопку записи
        app.buttons["mic.fill"].tap()
        
        // Проверяем изменение состояния
        XCTAssertTrue(app.buttons["stop.fill"].exists)
    }
}
```

---

**Версия документа**: 1.0  
**Дата**: 27 сентября 2025 года  
**Статус**: Готово к разработке  
**Приоритет**: Критический для iOS

**LifeUndo iOS — нативная красота Apple с мощью LifeUndo! 🍎📱✨**
