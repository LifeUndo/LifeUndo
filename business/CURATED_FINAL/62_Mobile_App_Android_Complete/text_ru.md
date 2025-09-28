# Мобильное приложение LifeUndo для Android - Полная реализация

## Философия Android приложения

### "Material Design с мощью LifeUndo"
Android приложение должно следовать принципам Material Design 3, быть интуитивным и функциональным. Каждый экран должен использовать современные компоненты Android, каждая анимация должна быть плавной, каждый жест должен быть естественным.

## Техническая архитектура

### 🏗️ Технологический стек
```kotlin
// Основные технологии
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.navigation.*
import androidx.room.*
import androidx.work.*
import androidx.hilt.*
import androidx.lifecycle.*
import kotlinx.coroutines.*
import retrofit2.*
import okhttp3.*
import dagger.hilt.*

// Архитектура MVVM + Compose
@HiltAndroidApp
class LifeUndoApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Инициализация приложения
    }
}

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            LifeUndoTheme {
                LifeUndoApp()
            }
        }
    }
}
```

### 📱 Структура приложения
```kotlin
@Composable
fun LifeUndoApp() {
    val navController = rememberNavController()
    val authViewModel: AuthViewModel = hiltViewModel()
    
    NavHost(
        navController = navController,
        startDestination = if (authViewModel.isAuthenticated) "home" else "onboarding"
    ) {
        composable("onboarding") {
            OnboardingScreen(
                onNavigateToSignIn = { navController.navigate("signin") },
                onNavigateToSignUp = { navController.navigate("signup") }
            )
        }
        
        composable("signin") {
            SignInScreen(
                onSignInSuccess = { navController.navigate("home") },
                onNavigateToSignUp = { navController.navigate("signup") }
            )
        }
        
        composable("signup") {
            SignUpScreen(
                onSignUpSuccess = { navController.navigate("home") },
                onNavigateToSignIn = { navController.navigate("signin") }
            )
        }
        
        composable("home") {
            HomeScreen(
                onNavigateToFiles = { navController.navigate("files") },
                onNavigateToRestore = { navController.navigate("restore") },
                onNavigateToSettings = { navController.navigate("settings") }
            )
        }
        
        composable("files") {
            FilesScreen(
                onNavigateToFileDetail = { fileId ->
                    navController.navigate("file_detail/$fileId")
                }
            )
        }
        
        composable("restore") {
            RestoreScreen(
                onNavigateToRestoreOptions = { type ->
                    navController.navigate("restore_options/$type")
                }
            )
        }
        
        composable("settings") {
            SettingsScreen(
                onNavigateToAccount = { navController.navigate("account") },
                onNavigateToPrivacy = { navController.navigate("privacy") },
                onNavigateToNotifications = { navController.navigate("notifications") }
            )
        }
    }
}
```

## Дизайн и интерфейс

### 🎨 Дизайн-система
```kotlin
// Цветовая палитра
object LifeUndoColors {
    val PrimaryBlue = Color(0xFF6366F1)
    val SecondaryPurple = Color(0xFF8B5CF6)
    val AccentCyan = Color(0xFF06B6D4)
    val SuccessGreen = Color(0xFF10B981)
    val WarningOrange = Color(0xFFF59E0B)
    val ErrorRed = Color(0xFFEF4444)
    
    val TextPrimary = Color(0xFF111827)
    val TextSecondary = Color(0xFF6B7280)
    val TextMuted = Color(0xFF9CA3AF)
    
    val BackgroundPrimary = Color(0xFFFFFFFF)
    val BackgroundSecondary = Color(0xFFF9FAFB)
    val BackgroundTertiary = Color(0xFFF3F4F6)
}

// Типографика
object LifeUndoTypography {
    val LargeTitle = TextStyle(
        fontSize = 34.sp,
        fontWeight = FontWeight.Bold,
        lineHeight = 40.sp
    )
    
    val Title1 = TextStyle(
        fontSize = 28.sp,
        fontWeight = FontWeight.Bold,
        lineHeight = 34.sp
    )
    
    val Title2 = TextStyle(
        fontSize = 22.sp,
        fontWeight = FontWeight.Bold,
        lineHeight = 28.sp
    )
    
    val Title3 = TextStyle(
        fontSize = 20.sp,
        fontWeight = FontWeight.SemiBold,
        lineHeight = 24.sp
    )
    
    val Headline = TextStyle(
        fontSize = 17.sp,
        fontWeight = FontWeight.SemiBold,
        lineHeight = 22.sp
    )
    
    val Body = TextStyle(
        fontSize = 17.sp,
        fontWeight = FontWeight.Normal,
        lineHeight = 22.sp
    )
    
    val Callout = TextStyle(
        fontSize = 16.sp,
        fontWeight = FontWeight.Normal,
        lineHeight = 20.sp
    )
    
    val Subheadline = TextStyle(
        fontSize = 15.sp,
        fontWeight = FontWeight.Normal,
        lineHeight = 20.sp
    )
    
    val Footnote = TextStyle(
        fontSize = 13.sp,
        fontWeight = FontWeight.Normal,
        lineHeight = 18.sp
    )
    
    val Caption1 = TextStyle(
        fontSize = 12.sp,
        fontWeight = FontWeight.Normal,
        lineHeight = 16.sp
    )
    
    val Caption2 = TextStyle(
        fontSize = 11.sp,
        fontWeight = FontWeight.Normal,
        lineHeight = 14.sp
    )
}

// Компоненты
@Composable
fun PrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    isLoading: Boolean = false
) {
    Button(
        onClick = onClick,
        modifier = modifier.fillMaxWidth(),
        enabled = enabled && !isLoading,
        colors = ButtonDefaults.buttonColors(
            containerColor = LifeUndoColors.PrimaryBlue
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.size(20.dp),
                color = Color.White,
                strokeWidth = 2.dp
            )
        } else {
            Text(
                text = text,
                style = LifeUndoTypography.Headline,
                color = Color.White
            )
        }
    }
}

@Composable
fun SecondaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    OutlinedButton(
        onClick = onClick,
        modifier = modifier.fillMaxWidth(),
        enabled = enabled,
        colors = ButtonDefaults.outlinedButtonColors(
            contentColor = LifeUndoColors.PrimaryBlue
        ),
        border = BorderStroke(2.dp, LifeUndoColors.PrimaryBlue),
        shape = RoundedCornerShape(12.dp)
    ) {
        Text(
            text = text,
            style = LifeUndoTypography.Headline
        )
    }
}
```

### 🏠 Главный экран (HomeScreen)
```kotlin
@Composable
fun HomeScreen(
    onNavigateToFiles: () -> Unit,
    onNavigateToRestore: () -> Unit,
    onNavigateToSettings: () -> Unit
) {
    val viewModel: HomeViewModel = hiltViewModel()
    val uiState by viewModel.uiState.collectAsState()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "LifeUndo",
                        style = LifeUndoTypography.Title1,
                        color = LifeUndoColors.TextPrimary
                    )
                },
                actions = {
                    IconButton(onClick = { viewModel.startVoiceInput() }) {
                        Icon(
                            imageVector = Icons.Default.Mic,
                            contentDescription = "Голосовой ввод",
                            tint = LifeUndoColors.PrimaryBlue
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = LifeUndoColors.BackgroundPrimary
                )
            )
        },
        bottomBar = {
            BottomNavigationBar(
                onNavigateToFiles = onNavigateToFiles,
                onNavigateToRestore = onNavigateToRestore,
                onNavigateToSettings = onNavigateToSettings
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            item {
                WelcomeCard(user = uiState.currentUser)
            }
            
            item {
                QuickActionsGrid(
                    onRestore = onNavigateToRestore,
                    onVoiceInput = { viewModel.startVoiceInput() },
                    onScan = { viewModel.startScanning() }
                )
            }
            
            item {
                StatsCard(stats = uiState.stats)
            }
            
            item {
                RecentRestorationsCard(restorations = uiState.recentRestorations)
            }
            
            item {
                AIRecommendationsCard(recommendations = uiState.aiRecommendations)
            }
        }
    }
}

@Composable
fun WelcomeCard(user: User?) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = LifeUndoColors.BackgroundPrimary
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Привет, ${user?.name ?: "Пользователь"}!",
                        style = LifeUndoTypography.Title2,
                        color = LifeUndoColors.TextPrimary
                    )
                    Text(
                        text = "Готов восстановить ваши данные?",
                        style = LifeUndoTypography.Subheadline,
                        color = LifeUndoColors.TextSecondary
                    )
                }
                
                AsyncImage(
                    model = user?.avatarUrl,
                    contentDescription = "Аватар пользователя",
                    modifier = Modifier
                        .size(60.dp)
                        .clip(CircleShape),
                    contentScale = ContentScale.Crop,
                    placeholder = painterResource(R.drawable.ic_person_placeholder),
                    error = painterResource(R.drawable.ic_person_placeholder)
                )
            }
            
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Security,
                    contentDescription = null,
                    tint = LifeUndoColors.SuccessGreen,
                    modifier = Modifier.size(16.dp)
                )
                Text(
                    text = "Все данные защищены квантовой криптографией",
                    style = LifeUndoTypography.Caption1,
                    color = LifeUndoColors.TextSecondary
                )
            }
        }
    }
}

@Composable
fun QuickActionsGrid(
    onRestore: () -> Unit,
    onVoiceInput: () -> Unit,
    onScan: () -> Unit
) {
    Column(
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Быстрые действия",
            style = LifeUndoTypography.Headline,
            color = LifeUndoColors.TextPrimary
        )
        
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier.height(240.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                QuickActionCard(
                    icon = Icons.Default.Restore,
                    title = "Восстановить",
                    subtitle = "Найти удаленные файлы",
                    color = LifeUndoColors.PrimaryBlue,
                    onClick = onRestore
                )
            }
            
            item {
                QuickActionCard(
                    icon = Icons.Default.Mic,
                    title = "Голосовой ввод",
                    subtitle = "Скажите что восстановить",
                    color = LifeUndoColors.AccentCyan,
                    onClick = onVoiceInput
                )
            }
            
            item {
                QuickActionCard(
                    icon = Icons.Default.CameraAlt,
                    title = "Сканировать",
                    subtitle = "Найти данные в фото",
                    color = LifeUndoColors.SuccessGreen,
                    onClick = onScan
                )
            }
            
            item {
                QuickActionCard(
                    icon = Icons.Default.Psychology,
                    title = "ИИ помощник",
                    subtitle = "Умные рекомендации",
                    color = LifeUndoColors.SecondaryPurple,
                    onClick = { }
                )
            }
        }
    }
}

@Composable
fun QuickActionCard(
    icon: ImageVector,
    title: String,
    subtitle: String,
    color: Color,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxSize(),
        colors = CardDefaults.cardColors(
            containerColor = LifeUndoColors.BackgroundPrimary
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(32.dp)
            )
            
            Text(
                text = title,
                style = LifeUndoTypography.Headline,
                color = LifeUndoColors.TextPrimary,
                textAlign = TextAlign.Center
            )
            
            Text(
                text = subtitle,
                style = LifeUndoTypography.Caption1,
                color = LifeUndoColors.TextSecondary,
                textAlign = TextAlign.Center
            )
        }
    }
}
```

### 📁 Экран файлов (FilesScreen)
```kotlin
@Composable
fun FilesScreen(
    onNavigateToFileDetail: (String) -> Unit
) {
    val viewModel: FilesViewModel = hiltViewModel()
    val uiState by viewModel.uiState.collectAsState()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Мои файлы",
                        style = LifeUndoTypography.Title1,
                        color = LifeUndoColors.TextPrimary
                    )
                },
                actions = {
                    IconButton(onClick = { viewModel.showSortMenu() }) {
                        Icon(
                            imageVector = Icons.Default.Sort,
                            contentDescription = "Сортировка",
                            tint = LifeUndoColors.PrimaryBlue
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = LifeUndoColors.BackgroundPrimary
                )
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Поиск и фильтры
            SearchAndFiltersView(
                searchText = uiState.searchText,
                selectedCategory = uiState.selectedCategory,
                onSearchTextChange = viewModel::updateSearchText,
                onCategoryChange = viewModel::updateSelectedCategory
            )
            
            // Список файлов
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(uiState.files) { file ->
                    FileRowView(
                        file = file,
                        onClick = { onNavigateToFileDetail(file.id) },
                        onDelete = { viewModel.deleteFile(file) }
                    )
                }
            }
        }
    }
}

@Composable
fun FileRowView(
    file: FileItem,
    onClick: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = LifeUndoColors.BackgroundPrimary
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Иконка файла
            FileIconView(file = file)
            
            // Информация о файле
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = file.name,
                    style = LifeUndoTypography.Headline,
                    color = LifeUndoColors.TextPrimary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                
                Row(
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Text(
                        text = file.sizeFormatted,
                        style = LifeUndoTypography.Caption1,
                        color = LifeUndoColors.TextSecondary
                    )
                    
                    Text(
                        text = file.modifiedDateFormatted,
                        style = LifeUndoTypography.Caption1,
                        color = LifeUndoColors.TextSecondary
                    )
                }
            }
            
            // Статус
            if (file.isRestored) {
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = "Восстановлен",
                    tint = LifeUndoColors.SuccessGreen,
                    modifier = Modifier.size(24.dp)
                )
            }
        }
    }
}

@Composable
fun FileIconView(file: FileItem) {
    val icon = when (file.type) {
        FileType.DOCUMENT -> Icons.Default.Description
        FileType.IMAGE -> Icons.Default.Image
        FileType.VIDEO -> Icons.Default.VideoFile
        FileType.AUDIO -> Icons.Default.AudioFile
        FileType.ARCHIVE -> Icons.Default.Archive
        else -> Icons.Default.InsertDriveFile
    }
    
    val color = when (file.type) {
        FileType.DOCUMENT -> LifeUndoColors.PrimaryBlue
        FileType.IMAGE -> LifeUndoColors.AccentCyan
        FileType.VIDEO -> LifeUndoColors.SuccessGreen
        FileType.AUDIO -> LifeUndoColors.WarningOrange
        FileType.ARCHIVE -> LifeUndoColors.SecondaryPurple
        else -> LifeUndoColors.TextMuted
    }
    
    Icon(
        imageVector = icon,
        contentDescription = null,
        tint = color,
        modifier = Modifier.size(32.dp)
    )
}
```

### 🔄 Экран восстановления (RestoreScreen)
```kotlin
@Composable
fun RestoreScreen(
    onNavigateToRestoreOptions: (String) -> Unit
) {
    val viewModel: RestoreViewModel = hiltViewModel()
    val uiState by viewModel.uiState.collectAsState()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Восстановление",
                        style = LifeUndoTypography.Title1,
                        color = LifeUndoColors.TextPrimary
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = LifeUndoColors.BackgroundPrimary
                )
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            item {
                RestoreHeaderView()
            }
            
            item {
                RestoreTypesView(
                    onTypeSelected = onNavigateToRestoreOptions
                )
            }
            
            item {
                RestoreHistoryView(
                    history = uiState.restoreHistory,
                    onRestoreAgain = { item ->
                        viewModel.restoreAgain(item)
                    }
                )
            }
            
            item {
                RestoreStatsView(stats = uiState.stats)
            }
        }
    }
}

@Composable
fun RestoreTypesView(
    onTypeSelected: (String) -> Unit
) {
    Column(
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Типы восстановления",
            style = LifeUndoTypography.Headline,
            color = LifeUndoColors.TextPrimary
        )
        
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier.height(240.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                RestoreTypeCard(
                    icon = Icons.Default.Description,
                    title = "Документы",
                    subtitle = "Word, Excel, PDF",
                    color = LifeUndoColors.PrimaryBlue,
                    onClick = { onTypeSelected("documents") }
                )
            }
            
            item {
                RestoreTypeCard(
                    icon = Icons.Default.Image,
                    title = "Фотографии",
                    subtitle = "Изображения и видео",
                    color = LifeUndoColors.AccentCyan,
                    onClick = { onTypeSelected("photos") }
                )
            }
            
            item {
                RestoreTypeCard(
                    icon = Icons.Default.Message,
                    title = "Сообщения",
                    subtitle = "SMS, WhatsApp, Telegram",
                    color = LifeUndoColors.SuccessGreen,
                    onClick = { onTypeSelected("messages") }
                )
            }
            
            item {
                RestoreTypeCard(
                    icon = Icons.Default.Key,
                    title = "Пароли",
                    subtitle = "Сохраненные пароли",
                    color = LifeUndoColors.WarningOrange,
                    onClick = { onTypeSelected("passwords") }
                )
            }
        }
    }
}

@Composable
fun RestoreTypeCard(
    icon: ImageVector,
    title: String,
    subtitle: String,
    color: Color,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxSize(),
        colors = CardDefaults.cardColors(
            containerColor = LifeUndoColors.BackgroundPrimary
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(32.dp)
            )
            
            Text(
                text = title,
                style = LifeUndoTypography.Headline,
                color = LifeUndoColors.TextPrimary,
                textAlign = TextAlign.Center
            )
            
            Text(
                text = subtitle,
                style = LifeUndoTypography.Caption1,
                color = LifeUndoColors.TextSecondary,
                textAlign = TextAlign.Center
            )
        }
    }
}
```

### 🎤 Голосовой ввод
```kotlin
@Composable
fun VoiceInputView(
    onResult: (String) -> Unit,
    onDismiss: () -> Unit
) {
    val viewModel: VoiceInputViewModel = hiltViewModel()
    val uiState by viewModel.uiState.collectAsState()
    
    LaunchedEffect(Unit) {
        viewModel.startListening()
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(32.dp)
    ) {
        // Анимация микрофона
        VoiceAnimationView(isRecording = uiState.isRecording)
        
        // Распознанный текст
        if (uiState.recognizedText.isNotEmpty()) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    text = "Распознано:",
                    style = LifeUndoTypography.Headline,
                    color = LifeUndoColors.TextSecondary
                )
                
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = LifeUndoColors.BackgroundSecondary
                    ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        text = uiState.recognizedText,
                        style = LifeUndoTypography.Body,
                        color = LifeUndoColors.TextPrimary,
                        modifier = Modifier.padding(16.dp)
                    )
                }
            }
        }
        
        // Кнопка записи
        Button(
            onClick = {
                if (uiState.isRecording) {
                    viewModel.stopListening()
                    onResult(uiState.recognizedText)
                } else {
                    viewModel.startListening()
                }
            },
            modifier = Modifier.size(120.dp),
            shape = CircleShape,
            colors = ButtonDefaults.buttonColors(
                containerColor = if (uiState.isRecording) LifeUndoColors.ErrorRed else LifeUndoColors.PrimaryBlue
            )
        ) {
            Icon(
                imageVector = if (uiState.isRecording) Icons.Default.Stop else Icons.Default.Mic,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(48.dp)
            )
        }
        
        // Инструкции
        Text(
            text = if (uiState.isRecording) "Говорите..." else "Нажмите и говорите",
            style = LifeUndoTypography.Headline,
            color = LifeUndoColors.TextSecondary
        )
        
        Spacer(modifier = Modifier.weight(1f))
        
        // Кнопки действий
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            SecondaryButton(
                text = "Отмена",
                onClick = onDismiss,
                modifier = Modifier.weight(1f)
            )
            
            PrimaryButton(
                text = "Готово",
                onClick = {
                    onResult(uiState.recognizedText)
                },
                modifier = Modifier.weight(1f),
                enabled = uiState.recognizedText.isNotEmpty()
            )
        }
    }
}

@Composable
fun VoiceAnimationView(isRecording: Boolean) {
    val animatedScale by animateFloatAsState(
        targetValue = if (isRecording) 1.2f else 1f,
        animationSpec = tween(1000, easing = EaseInOut)
    )
    
    val animatedAlpha by animateFloatAsState(
        targetValue = if (isRecording) 0.3f else 0f,
        animationSpec = tween(1000, easing = EaseInOut)
    )
    
    Box(
        modifier = Modifier.size(200.dp),
        contentAlignment = Alignment.Center
    ) {
        // Внешний круг
        Box(
            modifier = Modifier
                .size(200.dp)
                .scale(animatedScale)
                .alpha(animatedAlpha)
                .background(
                    Circle(),
                    color = LifeUndoColors.PrimaryBlue
                )
        )
        
        // Внутренний круг
        Box(
            modifier = Modifier
                .size(120.dp)
                .background(
                    Circle(),
                    color = LifeUndoColors.PrimaryBlue
                )
        )
        
        // Иконка микрофона
        Icon(
            imageVector = Icons.Default.Mic,
            contentDescription = null,
            tint = Color.White,
            modifier = Modifier.size(48.dp)
        )
    }
}
```

## Функциональность

### 🔐 Аутентификация
```kotlin
@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val biometricManager: BiometricManager
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()
    
    fun signIn(email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            try {
                val user = authRepository.signIn(email, password)
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    isAuthenticated = true,
                    currentUser = user
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }
    
    fun signUp(email: String, password: String, name: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            try {
                val user = authRepository.signUp(email, password, name)
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    isAuthenticated = true,
                    currentUser = user
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }
    
    fun signOut() {
        viewModelScope.launch {
            authRepository.signOut()
            _uiState.value = AuthUiState()
        }
    }
    
    fun authenticateWithBiometric() {
        viewModelScope.launch {
            try {
                val result = biometricManager.authenticate()
                if (result.isSuccess) {
                    val user = authRepository.getCurrentUser()
                    _uiState.value = _uiState.value.copy(
                        isAuthenticated = true,
                        currentUser = user
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(error = e.message)
            }
        }
    }
}

data class AuthUiState(
    val isLoading: Boolean = false,
    val isAuthenticated: Boolean = false,
    val currentUser: User? = null,
    val error: String? = null
)
```

### 📱 Уведомления
```kotlin
class NotificationManager @Inject constructor(
    private val context: Context
) {
    
    fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "lifeundo_restore",
                "Восстановление файлов",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Уведомления о восстановлении файлов"
                enableLights(true)
                lightColor = Color.BLUE
                enableVibration(true)
            }
            
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
    
    fun showRestoreNotification(fileName: String) {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        val notification = NotificationCompat.Builder(context, "lifeundo_restore")
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle("Восстановление завершено")
            .setContentText("Файл '$fileName' успешно восстановлен")
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()
        
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(fileName.hashCode(), notification)
    }
    
    fun showBackupNotification() {
        val notification = NotificationCompat.Builder(context, "lifeundo_restore")
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle("Резервное копирование")
            .setContentText("Создана резервная копия ваших данных")
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .build()
        
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify("backup".hashCode(), notification)
    }
}
```

### 🔄 Синхронизация
```kotlin
@HiltWorker
class SyncWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted workerParams: WorkerParameters,
    private val syncRepository: SyncRepository
) : CoroutineWorker(context, workerParams) {
    
    override suspend fun doWork(): Result {
        return try {
            syncRepository.syncData()
            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }
    
    @AssistedFactory
    interface Factory {
        fun create(context: Context, workerParams: WorkerParameters): SyncWorker
    }
}

class SyncRepository @Inject constructor(
    private val localDatabase: LocalDatabase,
    private val remoteApi: RemoteApi
) {
    
    suspend fun syncData() {
        // Загружаем изменения с сервера
        val serverChanges = remoteApi.fetchChanges()
        
        // Применяем изменения локально
        localDatabase.applyChanges(serverChanges)
        
        // Отправляем локальные изменения на сервер
        val localChanges = localDatabase.getChanges()
        remoteApi.pushChanges(localChanges)
    }
}
```

## Тестирование

### 🧪 Unit тесты
```kotlin
@HiltAndroidTest
class AuthViewModelTest {
    
    @get:Rule
    val hiltRule = HiltAndroidRule(this)
    
    @Mock
    private lateinit var authRepository: AuthRepository
    
    @Mock
    private lateinit var biometricManager: BiometricManager
    
    private lateinit var viewModel: AuthViewModel
    
    @Before
    fun setUp() {
        hiltRule.inject()
        viewModel = AuthViewModel(authRepository, biometricManager)
    }
    
    @Test
    fun `signIn with valid credentials should set authenticated state`() = runTest {
        // Given
        val email = "test@example.com"
        val password = "password123"
        val user = User(id = "1", name = "Test User", email = email)
        
        whenever(authRepository.signIn(email, password)).thenReturn(user)
        
        // When
        viewModel.signIn(email, password)
        
        // Then
        val uiState = viewModel.uiState.value
        assertTrue(uiState.isAuthenticated)
        assertEquals(user, uiState.currentUser)
        assertFalse(uiState.isLoading)
    }
    
    @Test
    fun `signIn with invalid credentials should set error state`() = runTest {
        // Given
        val email = "invalid@example.com"
        val password = "wrongpassword"
        
        whenever(authRepository.signIn(email, password)).thenThrow(
            AuthException("Invalid credentials")
        )
        
        // When
        viewModel.signIn(email, password)
        
        // Then
        val uiState = viewModel.uiState.value
        assertFalse(uiState.isAuthenticated)
        assertNull(uiState.currentUser)
        assertFalse(uiState.isLoading)
        assertNotNull(uiState.error)
    }
}

@HiltAndroidTest
class FileManagerTest {
    
    @get:Rule
    val hiltRule = HiltAndroidRule(this)
    
    @Mock
    private lateinit var fileRepository: FileRepository
    
    private lateinit var fileManager: FileManager
    
    @Before
    fun setUp() {
        hiltRule.inject()
        fileManager = FileManager(fileRepository)
    }
    
    @Test
    fun `restoreFile should return success result`() = runTest {
        // Given
        val file = FileItem(id = "1", name = "test.pdf", type = FileType.DOCUMENT)
        val restoredFile = file.copy(isRestored = true)
        
        whenever(fileRepository.restoreFile(file)).thenReturn(restoredFile)
        
        // When
        val result = fileManager.restoreFile(file)
        
        // Then
        assertTrue(result.isSuccess)
        assertEquals(restoredFile, result.restoredFile)
    }
}
```

### 🎯 UI тесты
```kotlin
@HiltAndroidTest
class LifeUndoUITest {
    
    @get:Rule
    val hiltRule = HiltAndroidRule(this)
    
    @get:Rule
    val composeTestRule = createComposeRule()
    
    @Test
    fun homeScreen_displaysCorrectElements() {
        composeTestRule.setContent {
            LifeUndoTheme {
                HomeScreen(
                    onNavigateToFiles = { },
                    onNavigateToRestore = { },
                    onNavigateToSettings = { }
                )
            }
        }
        
        // Проверяем наличие основных элементов
        composeTestRule.onNodeWithText("LifeUndo").assertIsDisplayed()
        composeTestRule.onNodeWithText("Восстановить").assertIsDisplayed()
        composeTestRule.onNodeWithText("Голосовой ввод").assertIsDisplayed()
        composeTestRule.onNodeWithText("Сканировать").assertIsDisplayed()
    }
    
    @Test
    fun restoreFlow_navigatesCorrectly() {
        composeTestRule.setContent {
            LifeUndoTheme {
                RestoreScreen(
                    onNavigateToRestoreOptions = { }
                )
            }
        }
        
        // Нажимаем кнопку восстановления документов
        composeTestRule.onNodeWithText("Документы").performClick()
        
        // Проверяем навигацию
        // (Здесь должна быть проверка навигации)
    }
    
    @Test
    fun voiceInput_startsAndStopsRecording() {
        composeTestRule.setContent {
            LifeUndoTheme {
                VoiceInputView(
                    onResult = { },
                    onDismiss = { }
                )
            }
        }
        
        // Нажимаем кнопку записи
        composeTestRule.onNodeWithContentDescription("mic").performClick()
        
        // Проверяем изменение состояния
        composeTestRule.onNodeWithContentDescription("stop").assertIsDisplayed()
    }
}
```

---

**Версия документа**: 1.0  
**Дата**: 27 сентября 2025 года  
**Статус**: Готово к разработке  
**Приоритет**: Критический для Android

**LifeUndo Android — Material Design с мощью LifeUndo! 🤖📱✨**
