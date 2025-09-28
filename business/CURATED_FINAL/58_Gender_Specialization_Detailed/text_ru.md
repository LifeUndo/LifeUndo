# Гендерная специализация LifeUndo - Детальная реализация

## Философия гендерной специализации

### "Понимание различий для лучшего сервиса"
LifeUndo должен учитывать гендерные особенности использования технологий, предпочтения в интерфейсе и специфические потребности в восстановлении данных. Это не дискриминация, а персонализация для максимального комфорта.

## Женские сообщества - Детальная реализация

### 👩 Женский интерфейс и функции

#### 🎨 Дизайн интерфейса
```css
/* Женский интерфейс - мягкие цвета и формы */
.women-interface {
  --primary-color: #e91e63;        /* Розовый */
  --secondary-color: #f8bbd9;      /* Светло-розовый */
  --accent-color: #ff6b9d;         /* Ярко-розовый */
  --background-color: #fef7f7;     /* Очень светлый розовый */
  --text-color: #4a4a4a;           /* Мягкий серый */
  --border-radius: 20px;            /* Округлые углы */
  --shadow: 0 4px 20px rgba(233, 30, 99, 0.15);
}

.women-button {
  background: linear-gradient(135deg, #e91e63, #ff6b9d);
  border: none;
  border-radius: 20px;
  padding: 12px 24px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(233, 30, 99, 0.3);
  transition: all 0.3s ease;
}

.women-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(233, 30, 99, 0.4);
}
```

#### 💄 Специализированные функции

##### Здоровье и красота
```typescript
// Женские функции здоровья и красоты
interface WomenHealthFeatures {
  // Дневник питания
  foodDiary: {
    addMeal: (meal: Meal) => Promise<void>;
    getNutritionStats: () => Promise<NutritionStats>;
    restoreDeletedMeals: () => Promise<Meal[]>;
    getMealSuggestions: () => Promise<Meal[]>;
  };
  
  // Косметические процедуры
  beautyRoutine: {
    addProcedure: (procedure: BeautyProcedure) => Promise<void>;
    getRoutineHistory: () => Promise<BeautyProcedure[]>;
    restoreDeletedRoutines: () => Promise<BeautyProcedure[]>;
    getProductRecommendations: () => Promise<BeautyProduct[]>;
  };
  
  // Цикл и здоровье
  cycleTracking: {
    logCycleData: (data: CycleData) => Promise<void>;
    getCycleHistory: () => Promise<CycleData[]>;
    restoreDeletedCycles: () => Promise<CycleData[]>;
    getHealthInsights: () => Promise<HealthInsight[]>;
  };
}

// Реализация функций здоровья
class WomenHealthManager {
  async restoreDeletedMeals(): Promise<Meal[]> {
    const deletedMeals = await this.findDeletedMeals();
    const restoredMeals = await this.restoreMeals(deletedMeals);
    
    // Отправляем уведомление
    this.sendNotification({
      title: "Восстановлены записи питания",
      message: `Восстановлено ${restoredMeals.length} записей о приемах пищи`,
      icon: "🍎"
    });
    
    return restoredMeals;
  }
  
  async restoreDeletedRoutines(): Promise<BeautyProcedure[]> {
    const deletedRoutines = await this.findDeletedRoutines();
    const restoredRoutines = await this.restoreRoutines(deletedRoutines);
    
    this.sendNotification({
      title: "Восстановлены косметические процедуры",
      message: `Восстановлено ${restoredRoutines.length} записей о процедурах`,
      icon: "💄"
    });
    
    return restoredRoutines;
  }
  
  async restoreDeletedCycles(): Promise<CycleData[]> {
    const deletedCycles = await this.findDeletedCycles();
    const restoredCycles = await this.restoreCycles(deletedCycles);
    
    this.sendNotification({
      title: "Восстановлены данные цикла",
      message: `Восстановлено ${restoredCycles.length} записей о цикле`,
      icon: "🌸"
    });
    
    return restoredCycles;
  }
}
```

##### Мода и стиль
```typescript
// Женские функции моды и стиля
interface WomenStyleFeatures {
  // Гардероб-планнер
  wardrobePlanner: {
    addOutfit: (outfit: Outfit) => Promise<void>;
    getOutfitHistory: () => Promise<Outfit[]>;
    restoreDeletedOutfits: () => Promise<Outfit[]>;
    getStyleSuggestions: () => Promise<StyleSuggestion[]>;
  };
  
  // Покупки и шопинг
  shoppingList: {
    addItem: (item: ShoppingItem) => Promise<void>;
    getShoppingHistory: () => Promise<ShoppingItem[]>;
    restoreDeletedLists: () => Promise<ShoppingItem[]>;
    getPriceAlerts: () => Promise<PriceAlert[]>;
  };
  
  // Красота и уход
  beautyProducts: {
    addProduct: (product: BeautyProduct) => Promise<void>;
    getProductHistory: () => Promise<BeautyProduct[]>;
    restoreDeletedProducts: () => Promise<BeautyProduct[]>;
    getExpirationAlerts: () => Promise<ExpirationAlert[]>;
  };
}

// Реализация функций стиля
class WomenStyleManager {
  async restoreDeletedOutfits(): Promise<Outfit[]> {
    const deletedOutfits = await this.findDeletedOutfits();
    const restoredOutfits = await this.restoreOutfits(deletedOutfits);
    
    this.sendNotification({
      title: "Восстановлены образы",
      message: `Восстановлено ${restoredOutfits.length} образов из гардероба`,
      icon: "👗"
    });
    
    return restoredOutfits;
  }
  
  async restoreDeletedShoppingLists(): Promise<ShoppingItem[]> {
    const deletedLists = await this.findDeletedShoppingLists();
    const restoredLists = await this.restoreShoppingLists(deletedLists);
    
    this.sendNotification({
      title: "Восстановлены списки покупок",
      message: `Восстановлено ${restoredLists.length} списков покупок`,
      icon: "🛍️"
    });
    
    return restoredLists;
  }
}
```

##### Семейные дела
```typescript
// Женские функции семейных дел
interface WomenFamilyFeatures {
  // Семейный календарь
  familyCalendar: {
    addEvent: (event: FamilyEvent) => Promise<void>;
    getEventHistory: () => Promise<FamilyEvent[]>;
    restoreDeletedEvents: () => Promise<FamilyEvent[]>;
    getUpcomingEvents: () => Promise<FamilyEvent[]>;
  };
  
  // Детские дела
  childrenManagement: {
    addChildActivity: (activity: ChildActivity) => Promise<void>;
    getActivityHistory: () => Promise<ChildActivity[]>;
    restoreDeletedActivities: () => Promise<ChildActivity[]>;
    getDevelopmentTracking: () => Promise<DevelopmentData[]>;
  };
  
  // Домашние дела
  householdManagement: {
    addTask: (task: HouseholdTask) => Promise<void>;
    getTaskHistory: () => Promise<HouseholdTask[]>;
    restoreDeletedTasks: () => Promise<HouseholdTask[]>;
    getTaskReminders: () => Promise<TaskReminder[]>;
  };
}

// Реализация семейных функций
class WomenFamilyManager {
  async restoreDeletedFamilyEvents(): Promise<FamilyEvent[]> {
    const deletedEvents = await this.findDeletedFamilyEvents();
    const restoredEvents = await this.restoreFamilyEvents(deletedEvents);
    
    this.sendNotification({
      title: "Восстановлены семейные события",
      message: `Восстановлено ${restoredEvents.length} семейных событий`,
      icon: "👨‍👩‍👧‍👦"
    });
    
    return restoredEvents;
  }
  
  async restoreDeletedChildActivities(): Promise<ChildActivity[]> {
    const deletedActivities = await this.findDeletedChildActivities();
    const restoredActivities = await this.restoreChildActivities(deletedActivities);
    
    this.sendNotification({
      title: "Восстановлены детские активности",
      message: `Восстановлено ${restoredActivities.length} записей о детях`,
      icon: "👶"
    });
    
    return restoredActivities;
  }
}
```

#### 💬 Женские голосовые команды
```javascript
const womenVoiceCommands = {
  // Здоровье и красота
  health: {
    "Восстанови мой дневник питания": {
      action: "restore_food_diary",
      response: "Восстанавливаю ваш дневник питания... 🍎"
    },
    "Найди все рецепты красоты и восстанови удаленные": {
      action: "restore_beauty_recipes",
      response: "Ищу и восстанавливаю рецепты красоты... 💄"
    },
    "Восстанови данные моего цикла": {
      action: "restore_cycle_data",
      response: "Восстанавливаю данные вашего цикла... 🌸"
    }
  },
  
  // Мода и стиль
  style: {
    "Восстанови мой гардероб-планнер": {
      action: "restore_wardrobe_planner",
      response: "Восстанавливаю ваш гардероб-планнер... 👗"
    },
    "Найди все списки покупок и восстанови удаленные": {
      action: "restore_shopping_lists",
      response: "Ищу и восстанавливаю списки покупок... 🛍️"
    },
    "Восстанови мою коллекцию косметики": {
      action: "restore_beauty_collection",
      response: "Восстанавливаю вашу коллекцию косметики... 💄"
    }
  },
  
  // Семейные дела
  family: {
    "Восстанови семейный календарь": {
      action: "restore_family_calendar",
      response: "Восстанавливаю семейный календарь... 👨‍👩‍👧‍👦"
    },
    "Найди все детские фотографии и восстанови удаленные": {
      action: "restore_children_photos",
      response: "Ищу и восстанавливаю детские фотографии... 👶"
    },
    "Восстанови мои рецепты": {
      action: "restore_recipes",
      response: "Восстанавливаю ваши рецепты... 👩‍🍳"
    }
  }
};
```

## Мужские сообщества - Детальная реализация

### 👨 Мужской интерфейс и функции

#### 🎨 Дизайн интерфейса
```css
/* Мужской интерфейс - строгие цвета и формы */
.men-interface {
  --primary-color: #1976d2;        /* Синий */
  --secondary-color: #42a5f5;      /* Светло-синий */
  --accent-color: #0d47a1;         /* Темно-синий */
  --background-color: #f5f5f5;     /* Светло-серый */
  --text-color: #212121;           /* Темно-серый */
  --border-radius: 8px;             /* Прямые углы */
  --shadow: 0 2px 10px rgba(25, 118, 210, 0.15);
}

.men-button {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(25, 118, 210, 0.3);
  transition: all 0.2s ease;
}

.men-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.4);
}
```

#### 💼 Специализированные функции

##### Карьера и бизнес
```typescript
// Мужские функции карьеры и бизнеса
interface MenCareerFeatures {
  // Бизнес-планы
  businessPlans: {
    addPlan: (plan: BusinessPlan) => Promise<void>;
    getPlanHistory: () => Promise<BusinessPlan[]>;
    restoreDeletedPlans: () => Promise<BusinessPlan[]>;
    getPlanAnalytics: () => Promise<PlanAnalytics[]>;
  };
  
  // Презентации
  presentations: {
    addPresentation: (presentation: Presentation) => Promise<void>;
    getPresentationHistory: () => Promise<Presentation[]>;
    restoreDeletedPresentations: () => Promise<Presentation[]>;
    getPresentationTemplates: () => Promise<PresentationTemplate[]>;
  };
  
  // Финансы
  financialTracking: {
    addTransaction: (transaction: FinancialTransaction) => Promise<void>;
    getTransactionHistory: () => Promise<FinancialTransaction[]>;
    restoreDeletedTransactions: () => Promise<FinancialTransaction[]>;
    getFinancialReports: () => Promise<FinancialReport[]>;
  };
}

// Реализация функций карьеры
class MenCareerManager {
  async restoreDeletedBusinessPlans(): Promise<BusinessPlan[]> {
    const deletedPlans = await this.findDeletedBusinessPlans();
    const restoredPlans = await this.restoreBusinessPlans(deletedPlans);
    
    this.sendNotification({
      title: "Восстановлены бизнес-планы",
      message: `Восстановлено ${restoredPlans.length} бизнес-планов`,
      icon: "📊"
    });
    
    return restoredPlans;
  }
  
  async restoreDeletedPresentations(): Promise<Presentation[]> {
    const deletedPresentations = await this.findDeletedPresentations();
    const restoredPresentations = await this.restorePresentations(deletedPresentations);
    
    this.sendNotification({
      title: "Восстановлены презентации",
      message: `Восстановлено ${restoredPresentations.length} презентаций`,
      icon: "📈"
    });
    
    return restoredPresentations;
  }
}
```

##### Фитнес и спорт
```typescript
// Мужские функции фитнеса и спорта
interface MenFitnessFeatures {
  // Тренировки
  workouts: {
    addWorkout: (workout: Workout) => Promise<void>;
    getWorkoutHistory: () => Promise<Workout[]>;
    restoreDeletedWorkouts: () => Promise<Workout[]>;
    getWorkoutAnalytics: () => Promise<WorkoutAnalytics[]>;
  };
  
  // Питание
  nutrition: {
    addMeal: (meal: NutritionMeal) => Promise<void>;
    getNutritionHistory: () => Promise<NutritionMeal[]>;
    restoreDeletedMeals: () => Promise<NutritionMeal[]>;
    getNutritionGoals: () => Promise<NutritionGoal[]>;
  };
  
  // Спортивные достижения
  achievements: {
    addAchievement: (achievement: SportAchievement) => Promise<void>;
    getAchievementHistory: () => Promise<SportAchievement[]>;
    restoreDeletedAchievements: () => Promise<SportAchievement[]>;
    getAchievementStats: () => Promise<AchievementStats[]>;
  };
}

// Реализация функций фитнеса
class MenFitnessManager {
  async restoreDeletedWorkouts(): Promise<Workout[]> {
    const deletedWorkouts = await this.findDeletedWorkouts();
    const restoredWorkouts = await this.restoreWorkouts(deletedWorkouts);
    
    this.sendNotification({
      title: "Восстановлены тренировки",
      message: `Восстановлено ${restoredWorkouts.length} тренировок`,
      icon: "💪"
    });
    
    return restoredWorkouts;
  }
  
  async restoreDeletedAchievements(): Promise<SportAchievement[]> {
    const deletedAchievements = await this.findDeletedAchievements();
    const restoredAchievements = await this.restoreAchievements(deletedAchievements);
    
    this.sendNotification({
      title: "Восстановлены спортивные достижения",
      message: `Восстановлено ${restoredAchievements.length} достижений`,
      icon: "🏆"
    });
    
    return restoredAchievements;
  }
}
```

##### Хобби и увлечения
```typescript
// Мужские функции хобби и увлечений
interface MenHobbyFeatures {
  // Коллекции
  collections: {
    addItem: (item: CollectionItem) => Promise<void>;
    getCollectionHistory: () => Promise<CollectionItem[]>;
    restoreDeletedItems: () => Promise<CollectionItem[]>;
    getCollectionValue: () => Promise<CollectionValue[]>;
  };
  
  // Проекты
  projects: {
    addProject: (project: HobbyProject) => Promise<void>;
    getProjectHistory: () => Promise<HobbyProject[]>;
    restoreDeletedProjects: () => Promise<HobbyProject[]>;
    getProjectProgress: () => Promise<ProjectProgress[]>;
  };
  
  // Инструменты
  tools: {
    addTool: (tool: Tool) => Promise<void>;
    getToolHistory: () => Promise<Tool[]>;
    restoreDeletedTools: () => Promise<Tool[]>;
    getToolMaintenance: () => Promise<ToolMaintenance[]>;
  };
}

// Реализация функций хобби
class MenHobbyManager {
  async restoreDeletedCollections(): Promise<CollectionItem[]> {
    const deletedItems = await this.findDeletedCollectionItems();
    const restoredItems = await this.restoreCollectionItems(deletedItems);
    
    this.sendNotification({
      title: "Восстановлены коллекции",
      message: `Восстановлено ${restoredItems.length} предметов коллекции`,
      icon: "🎯"
    });
    
    return restoredItems;
  }
  
  async restoreDeletedProjects(): Promise<HobbyProject[]> {
    const deletedProjects = await this.findDeletedProjects();
    const restoredProjects = await this.restoreProjects(deletedProjects);
    
    this.sendNotification({
      title: "Восстановлены проекты",
      message: `Восстановлено ${restoredProjects.length} проектов`,
      icon: "🔧"
    });
    
    return restoredProjects;
  }
}
```

#### 💬 Мужские голосовые команды
```javascript
const menVoiceCommands = {
  // Карьера и бизнес
  career: {
    "Восстанови мой бизнес-план": {
      action: "restore_business_plan",
      response: "Восстанавливаю ваш бизнес-план... 📊"
    },
    "Найди все презентации и восстанови удаленные": {
      action: "restore_presentations",
      response: "Ищу и восстанавливаю презентации... 📈"
    },
    "Восстанови финансовые отчеты": {
      action: "restore_financial_reports",
      response: "Восстанавливаю финансовые отчеты... 💰"
    }
  },
  
  // Фитнес и спорт
  fitness: {
    "Восстанови мои тренировки": {
      action: "restore_workouts",
      response: "Восстанавливаю ваши тренировки... 💪"
    },
    "Найди все спортивные достижения и восстанови удаленные": {
      action: "restore_achievements",
      response: "Ищу и восстанавливаю спортивные достижения... 🏆"
    },
    "Восстанови план питания": {
      action: "restore_nutrition_plan",
      response: "Восстанавливаю план питания... 🥗"
    }
  },
  
  // Хобби и увлечения
  hobbies: {
    "Восстанови мою коллекцию": {
      action: "restore_collection",
      response: "Восстанавливаю вашу коллекцию... 🎯"
    },
    "Найди все проекты и восстанови удаленные": {
      action: "restore_projects",
      response: "Ищу и восстанавливаю проекты... 🔧"
    },
    "Восстанови список инструментов": {
      action: "restore_tools",
      response: "Восстанавливаю список инструментов... 🛠️"
    }
  }
};
```

## Техническая реализация

### 🎯 Компонент гендерной специализации
```typescript
// Компонент гендерной специализации
interface GenderSpecializationProps {
  gender: 'male' | 'female' | 'non-binary';
  preferences: GenderPreferences;
  onFeatureSelect: (feature: string) => void;
}

const GenderSpecialization: React.FC<GenderSpecializationProps> = ({
  gender,
  preferences,
  onFeatureSelect
}) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  const genderFeatures = {
    female: {
      title: "Женские функции",
      icon: "👩",
      features: [
        { id: "health", name: "Здоровье и красота", icon: "💄" },
        { id: "style", name: "Мода и стиль", icon: "👗" },
        { id: "family", name: "Семейные дела", icon: "👨‍👩‍👧‍👦" },
        { id: "nutrition", name: "Питание", icon: "🍎" },
        { id: "beauty", name: "Красота", icon: "💅" }
      ]
    },
    male: {
      title: "Мужские функции",
      icon: "👨",
      features: [
        { id: "career", name: "Карьера и бизнес", icon: "💼" },
        { id: "fitness", name: "Фитнес и спорт", icon: "💪" },
        { id: "hobbies", name: "Хобби и увлечения", icon: "🎯" },
        { id: "finance", name: "Финансы", icon: "💰" },
        { id: "tools", name: "Инструменты", icon: "🔧" }
      ]
    },
    'non-binary': {
      title: "Универсальные функции",
      icon: "👤",
      features: [
        { id: "general", name: "Общие функции", icon: "📁" },
        { id: "work", name: "Работа", icon: "💼" },
        { id: "personal", name: "Личное", icon: "👤" },
        { id: "hobbies", name: "Хобби", icon: "🎨" },
        { id: "health", name: "Здоровье", icon: "🏥" }
      ]
    }
  };
  
  const currentGender = genderFeatures[gender];
  
  const handleFeatureSelect = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
    onFeatureSelect(featureId);
  };
  
  return (
    <div className={`gender-specialization ${gender}-interface`}>
      <div className="gender-header">
        <h2>{currentGender.icon} {currentGender.title}</h2>
        <p>Выберите функции, которые вас интересуют</p>
      </div>
      
      <div className="features-grid">
        {currentGender.features.map(feature => (
          <div
            key={feature.id}
            className={`feature-card ${selectedFeatures.includes(feature.id) ? 'selected' : ''}`}
            onClick={() => handleFeatureSelect(feature.id)}
          >
            <div className="feature-icon">{feature.icon}</div>
            <div className="feature-name">{feature.name}</div>
          </div>
        ))}
      </div>
      
      {selectedFeatures.length > 0 && (
        <div className="selected-features">
          <h3>Выбранные функции:</h3>
          <ul>
            {selectedFeatures.map(featureId => {
              const feature = currentGender.features.find(f => f.id === featureId);
              return (
                <li key={featureId}>
                  {feature?.icon} {feature?.name}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
```

### 🎨 Стили для гендерных интерфейсов
```css
/* Женский интерфейс */
.women-interface {
  --primary-color: #e91e63;
  --secondary-color: #f8bbd9;
  --accent-color: #ff6b9d;
  --background-color: #fef7f7;
  --text-color: #4a4a4a;
  --border-radius: 20px;
  --shadow: 0 4px 20px rgba(233, 30, 99, 0.15);
}

.women-interface .feature-card {
  background: linear-gradient(135deg, #fef7f7, #f8bbd9);
  border: 2px solid #ff6b9d;
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(233, 30, 99, 0.1);
}

.women-interface .feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(233, 30, 99, 0.2);
}

.women-interface .feature-card.selected {
  background: linear-gradient(135deg, #e91e63, #ff6b9d);
  color: white;
  transform: scale(1.05);
}

/* Мужской интерфейс */
.men-interface {
  --primary-color: #1976d2;
  --secondary-color: #42a5f5;
  --accent-color: #0d47a1;
  --background-color: #f5f5f5;
  --text-color: #212121;
  --border-radius: 8px;
  --shadow: 0 2px 10px rgba(25, 118, 210, 0.15);
}

.men-interface .feature-card {
  background: linear-gradient(135deg, #f5f5f5, #e3f2fd);
  border: 2px solid #1976d2;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 10px rgba(25, 118, 210, 0.1);
}

.men-interface .feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.2);
}

.men-interface .feature-card.selected {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: white;
  transform: scale(1.02);
}
```

## Примеры использования

### 🎯 Сценарии использования

#### Сценарий 1: Женский пользователь
```
Пользователь: Женщина, 28 лет, мама двоих детей
Выбранные функции: Здоровье и красота, Семейные дела, Питание

Команда: "Восстанови мой дневник питания"
Результат: Восстановлены записи о приемах пищи за последние 3 месяца
Уведомление: "Восстановлено 45 записей о приемах пищи 🍎"

Команда: "Найди все детские фотографии и восстанови удаленные"
Результат: Найдено и восстановлено 12 детских фотографий
Уведомление: "Восстановлено 12 детских фотографий 👶"
```

#### Сценарий 2: Мужской пользователь
```
Пользователь: Мужчина, 35 лет, предприниматель
Выбранные функции: Карьера и бизнес, Фитнес и спорт, Финансы

Команда: "Восстанови мой бизнес-план"
Результат: Восстановлен бизнес-план на 2025 год
Уведомление: "Восстановлен бизнес-план 📊"

Команда: "Найди все тренировки и восстанови удаленные"
Результат: Найдено и восстановлено 8 тренировок
Уведомление: "Восстановлено 8 тренировок 💪"
```

### 💰 Ценообразование
```javascript
const genderPricing = {
  female: {
    basePrice: 149, // ₽/месяц
    features: {
      health: 0,      // Включено в базовую цену
      style: 0,       // Включено в базовую цену
      family: 0,      // Включено в базовую цену
      nutrition: 0,   // Включено в базовую цену
      beauty: 0       // Включено в базовую цену
    },
    premiumFeatures: {
      personalStylist: 299,    // ₽/месяц
      nutritionist: 399,       // ₽/месяц
      familyPlanner: 199       // ₽/месяц
    }
  },
  
  male: {
    basePrice: 149, // ₽/месяц
    features: {
      career: 0,      // Включено в базовую цену
      fitness: 0,     // Включено в базовую цену
      hobbies: 0,     // Включено в базовую цену
      finance: 0,     // Включено в базовую цену
      tools: 0        // Включено в базовую цену
    },
    premiumFeatures: {
      businessAnalyst: 499,    // ₽/месяц
      fitnessTrainer: 399,     // ₽/месяц
      financialAdvisor: 599   // ₽/месяц
    }
  }
};
```

---

**Версия документа**: 1.0  
**Дата**: 27 сентября 2025 года  
**Статус**: Готово к внедрению  
**Приоритет**: Высокий для персонализации

**LifeUndo — понимает различия для лучшего сервиса! 👩👨🎯**
