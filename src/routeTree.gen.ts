/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DashboarduserImport } from './routes/dashboard_user'
import { Route as DashboardtrainerImport } from './routes/dashboard_trainer'
import { Route as DashboardadminImport } from './routes/dashboard_admin'
import { Route as IndexImport } from './routes/index'
import { Route as DashboarduserIndexImport } from './routes/dashboard_user/index'
import { Route as DashboardtrainerIndexImport } from './routes/dashboard_trainer/index'
import { Route as DashboardadminIndexImport } from './routes/dashboard_admin/index'
import { Route as DashboarduserTuitionImport } from './routes/dashboard_user/tuition'
import { Route as DashboarduserTrainingImport } from './routes/dashboard_user/training'
import { Route as DashboarduserTournamentImport } from './routes/dashboard_user/tournament'
import { Route as DashboarduserRequestsImport } from './routes/dashboard_user/requests'
import { Route as DashboarduserCategoriesImport } from './routes/dashboard_user/categories'
import { Route as DashboardtrainerUsercategoriesImport } from './routes/dashboard_trainer/user_categories'
import { Route as DashboardtrainerTrainingsImport } from './routes/dashboard_trainer/trainings'
import { Route as DashboardtrainerTournamentImport } from './routes/dashboard_trainer/tournament'
import { Route as DashboardadminUsermanagementImport } from './routes/dashboard_admin/user_management'
import { Route as DashboardadminTrainingmanagementImport } from './routes/dashboard_admin/training_management'
import { Route as DashboardadminTournamentmanagementImport } from './routes/dashboard_admin/tournament_management'
import { Route as DashboardadminRolemanagementImport } from './routes/dashboard_admin/role_management'
import { Route as DashboardadminRequestsImport } from './routes/dashboard_admin/requests'
import { Route as DashboardadminCourtsmanagementImport } from './routes/dashboard_admin/courts_management'
import { Route as DashboardadminCategoryuserImport } from './routes/dashboard_admin/category_user'
import { Route as DashboardadminCategorymanagementImport } from './routes/dashboard_admin/category_management'
import { Route as AuthSigninImport } from './routes/auth/signin'
import { Route as AuthLoginImport } from './routes/auth/login'
import { Route as DashboardtrainerReportsIndexImport } from './routes/dashboard_trainer/reports/index'
import { Route as DashboardtrainerReportsUserIdImport } from './routes/dashboard_trainer/reports/$userId'

// Create/Update Routes

const DashboarduserRoute = DashboarduserImport.update({
  id: '/dashboard_user',
  path: '/dashboard_user',
  getParentRoute: () => rootRoute,
} as any)

const DashboardtrainerRoute = DashboardtrainerImport.update({
  id: '/dashboard_trainer',
  path: '/dashboard_trainer',
  getParentRoute: () => rootRoute,
} as any)

const DashboardadminRoute = DashboardadminImport.update({
  id: '/dashboard_admin',
  path: '/dashboard_admin',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const DashboarduserIndexRoute = DashboarduserIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboarduserRoute,
} as any)

const DashboardtrainerIndexRoute = DashboardtrainerIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboardtrainerRoute,
} as any)

const DashboardadminIndexRoute = DashboardadminIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboardadminRoute,
} as any)

const DashboarduserTuitionRoute = DashboarduserTuitionImport.update({
  id: '/tuition',
  path: '/tuition',
  getParentRoute: () => DashboarduserRoute,
} as any)

const DashboarduserTrainingRoute = DashboarduserTrainingImport.update({
  id: '/training',
  path: '/training',
  getParentRoute: () => DashboarduserRoute,
} as any)

const DashboarduserTournamentRoute = DashboarduserTournamentImport.update({
  id: '/tournament',
  path: '/tournament',
  getParentRoute: () => DashboarduserRoute,
} as any)

const DashboarduserRequestsRoute = DashboarduserRequestsImport.update({
  id: '/requests',
  path: '/requests',
  getParentRoute: () => DashboarduserRoute,
} as any)

const DashboarduserCategoriesRoute = DashboarduserCategoriesImport.update({
  id: '/categories',
  path: '/categories',
  getParentRoute: () => DashboarduserRoute,
} as any)

const DashboardtrainerUsercategoriesRoute =
  DashboardtrainerUsercategoriesImport.update({
    id: '/user_categories',
    path: '/user_categories',
    getParentRoute: () => DashboardtrainerRoute,
  } as any)

const DashboardtrainerTrainingsRoute = DashboardtrainerTrainingsImport.update({
  id: '/trainings',
  path: '/trainings',
  getParentRoute: () => DashboardtrainerRoute,
} as any)

const DashboardtrainerTournamentRoute = DashboardtrainerTournamentImport.update(
  {
    id: '/tournament',
    path: '/tournament',
    getParentRoute: () => DashboardtrainerRoute,
  } as any,
)

const DashboardadminUsermanagementRoute =
  DashboardadminUsermanagementImport.update({
    id: '/user_management',
    path: '/user_management',
    getParentRoute: () => DashboardadminRoute,
  } as any)

const DashboardadminTrainingmanagementRoute =
  DashboardadminTrainingmanagementImport.update({
    id: '/training_management',
    path: '/training_management',
    getParentRoute: () => DashboardadminRoute,
  } as any)

const DashboardadminTournamentmanagementRoute =
  DashboardadminTournamentmanagementImport.update({
    id: '/tournament_management',
    path: '/tournament_management',
    getParentRoute: () => DashboardadminRoute,
  } as any)

const DashboardadminRolemanagementRoute =
  DashboardadminRolemanagementImport.update({
    id: '/role_management',
    path: '/role_management',
    getParentRoute: () => DashboardadminRoute,
  } as any)

const DashboardadminRequestsRoute = DashboardadminRequestsImport.update({
  id: '/requests',
  path: '/requests',
  getParentRoute: () => DashboardadminRoute,
} as any)

const DashboardadminCourtsmanagementRoute =
  DashboardadminCourtsmanagementImport.update({
    id: '/courts_management',
    path: '/courts_management',
    getParentRoute: () => DashboardadminRoute,
  } as any)

const DashboardadminCategoryuserRoute = DashboardadminCategoryuserImport.update(
  {
    id: '/category_user',
    path: '/category_user',
    getParentRoute: () => DashboardadminRoute,
  } as any,
)

const DashboardadminCategorymanagementRoute =
  DashboardadminCategorymanagementImport.update({
    id: '/category_management',
    path: '/category_management',
    getParentRoute: () => DashboardadminRoute,
  } as any)

const AuthSigninRoute = AuthSigninImport.update({
  id: '/auth/signin',
  path: '/auth/signin',
  getParentRoute: () => rootRoute,
} as any)

const AuthLoginRoute = AuthLoginImport.update({
  id: '/auth/login',
  path: '/auth/login',
  getParentRoute: () => rootRoute,
} as any)

const DashboardtrainerReportsIndexRoute =
  DashboardtrainerReportsIndexImport.update({
    id: '/reports/',
    path: '/reports/',
    getParentRoute: () => DashboardtrainerRoute,
  } as any)

const DashboardtrainerReportsUserIdRoute =
  DashboardtrainerReportsUserIdImport.update({
    id: '/reports/$userId',
    path: '/reports/$userId',
    getParentRoute: () => DashboardtrainerRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/dashboard_admin': {
      id: '/dashboard_admin'
      path: '/dashboard_admin'
      fullPath: '/dashboard_admin'
      preLoaderRoute: typeof DashboardadminImport
      parentRoute: typeof rootRoute
    }
    '/dashboard_trainer': {
      id: '/dashboard_trainer'
      path: '/dashboard_trainer'
      fullPath: '/dashboard_trainer'
      preLoaderRoute: typeof DashboardtrainerImport
      parentRoute: typeof rootRoute
    }
    '/dashboard_user': {
      id: '/dashboard_user'
      path: '/dashboard_user'
      fullPath: '/dashboard_user'
      preLoaderRoute: typeof DashboarduserImport
      parentRoute: typeof rootRoute
    }
    '/auth/login': {
      id: '/auth/login'
      path: '/auth/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof AuthLoginImport
      parentRoute: typeof rootRoute
    }
    '/auth/signin': {
      id: '/auth/signin'
      path: '/auth/signin'
      fullPath: '/auth/signin'
      preLoaderRoute: typeof AuthSigninImport
      parentRoute: typeof rootRoute
    }
    '/dashboard_admin/category_management': {
      id: '/dashboard_admin/category_management'
      path: '/category_management'
      fullPath: '/dashboard_admin/category_management'
      preLoaderRoute: typeof DashboardadminCategorymanagementImport
      parentRoute: typeof DashboardadminImport
    }
    '/dashboard_admin/category_user': {
      id: '/dashboard_admin/category_user'
      path: '/category_user'
      fullPath: '/dashboard_admin/category_user'
      preLoaderRoute: typeof DashboardadminCategoryuserImport
      parentRoute: typeof DashboardadminImport
    }
    '/dashboard_admin/courts_management': {
      id: '/dashboard_admin/courts_management'
      path: '/courts_management'
      fullPath: '/dashboard_admin/courts_management'
      preLoaderRoute: typeof DashboardadminCourtsmanagementImport
      parentRoute: typeof DashboardadminImport
    }
    '/dashboard_admin/requests': {
      id: '/dashboard_admin/requests'
      path: '/requests'
      fullPath: '/dashboard_admin/requests'
      preLoaderRoute: typeof DashboardadminRequestsImport
      parentRoute: typeof DashboardadminImport
    }
    '/dashboard_admin/role_management': {
      id: '/dashboard_admin/role_management'
      path: '/role_management'
      fullPath: '/dashboard_admin/role_management'
      preLoaderRoute: typeof DashboardadminRolemanagementImport
      parentRoute: typeof DashboardadminImport
    }
    '/dashboard_admin/tournament_management': {
      id: '/dashboard_admin/tournament_management'
      path: '/tournament_management'
      fullPath: '/dashboard_admin/tournament_management'
      preLoaderRoute: typeof DashboardadminTournamentmanagementImport
      parentRoute: typeof DashboardadminImport
    }
    '/dashboard_admin/training_management': {
      id: '/dashboard_admin/training_management'
      path: '/training_management'
      fullPath: '/dashboard_admin/training_management'
      preLoaderRoute: typeof DashboardadminTrainingmanagementImport
      parentRoute: typeof DashboardadminImport
    }
    '/dashboard_admin/user_management': {
      id: '/dashboard_admin/user_management'
      path: '/user_management'
      fullPath: '/dashboard_admin/user_management'
      preLoaderRoute: typeof DashboardadminUsermanagementImport
      parentRoute: typeof DashboardadminImport
    }
    '/dashboard_trainer/tournament': {
      id: '/dashboard_trainer/tournament'
      path: '/tournament'
      fullPath: '/dashboard_trainer/tournament'
      preLoaderRoute: typeof DashboardtrainerTournamentImport
      parentRoute: typeof DashboardtrainerImport
    }
    '/dashboard_trainer/trainings': {
      id: '/dashboard_trainer/trainings'
      path: '/trainings'
      fullPath: '/dashboard_trainer/trainings'
      preLoaderRoute: typeof DashboardtrainerTrainingsImport
      parentRoute: typeof DashboardtrainerImport
    }
    '/dashboard_trainer/user_categories': {
      id: '/dashboard_trainer/user_categories'
      path: '/user_categories'
      fullPath: '/dashboard_trainer/user_categories'
      preLoaderRoute: typeof DashboardtrainerUsercategoriesImport
      parentRoute: typeof DashboardtrainerImport
    }
    '/dashboard_user/categories': {
      id: '/dashboard_user/categories'
      path: '/categories'
      fullPath: '/dashboard_user/categories'
      preLoaderRoute: typeof DashboarduserCategoriesImport
      parentRoute: typeof DashboarduserImport
    }
    '/dashboard_user/requests': {
      id: '/dashboard_user/requests'
      path: '/requests'
      fullPath: '/dashboard_user/requests'
      preLoaderRoute: typeof DashboarduserRequestsImport
      parentRoute: typeof DashboarduserImport
    }
    '/dashboard_user/tournament': {
      id: '/dashboard_user/tournament'
      path: '/tournament'
      fullPath: '/dashboard_user/tournament'
      preLoaderRoute: typeof DashboarduserTournamentImport
      parentRoute: typeof DashboarduserImport
    }
    '/dashboard_user/training': {
      id: '/dashboard_user/training'
      path: '/training'
      fullPath: '/dashboard_user/training'
      preLoaderRoute: typeof DashboarduserTrainingImport
      parentRoute: typeof DashboarduserImport
    }
    '/dashboard_user/tuition': {
      id: '/dashboard_user/tuition'
      path: '/tuition'
      fullPath: '/dashboard_user/tuition'
      preLoaderRoute: typeof DashboarduserTuitionImport
      parentRoute: typeof DashboarduserImport
    }
    '/dashboard_admin/': {
      id: '/dashboard_admin/'
      path: '/'
      fullPath: '/dashboard_admin/'
      preLoaderRoute: typeof DashboardadminIndexImport
      parentRoute: typeof DashboardadminImport
    }
    '/dashboard_trainer/': {
      id: '/dashboard_trainer/'
      path: '/'
      fullPath: '/dashboard_trainer/'
      preLoaderRoute: typeof DashboardtrainerIndexImport
      parentRoute: typeof DashboardtrainerImport
    }
    '/dashboard_user/': {
      id: '/dashboard_user/'
      path: '/'
      fullPath: '/dashboard_user/'
      preLoaderRoute: typeof DashboarduserIndexImport
      parentRoute: typeof DashboarduserImport
    }
    '/dashboard_trainer/reports/$userId': {
      id: '/dashboard_trainer/reports/$userId'
      path: '/reports/$userId'
      fullPath: '/dashboard_trainer/reports/$userId'
      preLoaderRoute: typeof DashboardtrainerReportsUserIdImport
      parentRoute: typeof DashboardtrainerImport
    }
    '/dashboard_trainer/reports/': {
      id: '/dashboard_trainer/reports/'
      path: '/reports'
      fullPath: '/dashboard_trainer/reports'
      preLoaderRoute: typeof DashboardtrainerReportsIndexImport
      parentRoute: typeof DashboardtrainerImport
    }
  }
}

// Create and export the route tree

interface DashboardadminRouteChildren {
  DashboardadminCategorymanagementRoute: typeof DashboardadminCategorymanagementRoute
  DashboardadminCategoryuserRoute: typeof DashboardadminCategoryuserRoute
  DashboardadminCourtsmanagementRoute: typeof DashboardadminCourtsmanagementRoute
  DashboardadminRequestsRoute: typeof DashboardadminRequestsRoute
  DashboardadminRolemanagementRoute: typeof DashboardadminRolemanagementRoute
  DashboardadminTournamentmanagementRoute: typeof DashboardadminTournamentmanagementRoute
  DashboardadminTrainingmanagementRoute: typeof DashboardadminTrainingmanagementRoute
  DashboardadminUsermanagementRoute: typeof DashboardadminUsermanagementRoute
  DashboardadminIndexRoute: typeof DashboardadminIndexRoute
}

const DashboardadminRouteChildren: DashboardadminRouteChildren = {
  DashboardadminCategorymanagementRoute: DashboardadminCategorymanagementRoute,
  DashboardadminCategoryuserRoute: DashboardadminCategoryuserRoute,
  DashboardadminCourtsmanagementRoute: DashboardadminCourtsmanagementRoute,
  DashboardadminRequestsRoute: DashboardadminRequestsRoute,
  DashboardadminRolemanagementRoute: DashboardadminRolemanagementRoute,
  DashboardadminTournamentmanagementRoute:
    DashboardadminTournamentmanagementRoute,
  DashboardadminTrainingmanagementRoute: DashboardadminTrainingmanagementRoute,
  DashboardadminUsermanagementRoute: DashboardadminUsermanagementRoute,
  DashboardadminIndexRoute: DashboardadminIndexRoute,
}

const DashboardadminRouteWithChildren = DashboardadminRoute._addFileChildren(
  DashboardadminRouteChildren,
)

interface DashboardtrainerRouteChildren {
  DashboardtrainerTournamentRoute: typeof DashboardtrainerTournamentRoute
  DashboardtrainerTrainingsRoute: typeof DashboardtrainerTrainingsRoute
  DashboardtrainerUsercategoriesRoute: typeof DashboardtrainerUsercategoriesRoute
  DashboardtrainerIndexRoute: typeof DashboardtrainerIndexRoute
  DashboardtrainerReportsUserIdRoute: typeof DashboardtrainerReportsUserIdRoute
  DashboardtrainerReportsIndexRoute: typeof DashboardtrainerReportsIndexRoute
}

const DashboardtrainerRouteChildren: DashboardtrainerRouteChildren = {
  DashboardtrainerTournamentRoute: DashboardtrainerTournamentRoute,
  DashboardtrainerTrainingsRoute: DashboardtrainerTrainingsRoute,
  DashboardtrainerUsercategoriesRoute: DashboardtrainerUsercategoriesRoute,
  DashboardtrainerIndexRoute: DashboardtrainerIndexRoute,
  DashboardtrainerReportsUserIdRoute: DashboardtrainerReportsUserIdRoute,
  DashboardtrainerReportsIndexRoute: DashboardtrainerReportsIndexRoute,
}

const DashboardtrainerRouteWithChildren =
  DashboardtrainerRoute._addFileChildren(DashboardtrainerRouteChildren)

interface DashboarduserRouteChildren {
  DashboarduserCategoriesRoute: typeof DashboarduserCategoriesRoute
  DashboarduserRequestsRoute: typeof DashboarduserRequestsRoute
  DashboarduserTournamentRoute: typeof DashboarduserTournamentRoute
  DashboarduserTrainingRoute: typeof DashboarduserTrainingRoute
  DashboarduserTuitionRoute: typeof DashboarduserTuitionRoute
  DashboarduserIndexRoute: typeof DashboarduserIndexRoute
}

const DashboarduserRouteChildren: DashboarduserRouteChildren = {
  DashboarduserCategoriesRoute: DashboarduserCategoriesRoute,
  DashboarduserRequestsRoute: DashboarduserRequestsRoute,
  DashboarduserTournamentRoute: DashboarduserTournamentRoute,
  DashboarduserTrainingRoute: DashboarduserTrainingRoute,
  DashboarduserTuitionRoute: DashboarduserTuitionRoute,
  DashboarduserIndexRoute: DashboarduserIndexRoute,
}

const DashboarduserRouteWithChildren = DashboarduserRoute._addFileChildren(
  DashboarduserRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/dashboard_admin': typeof DashboardadminRouteWithChildren
  '/dashboard_trainer': typeof DashboardtrainerRouteWithChildren
  '/dashboard_user': typeof DashboarduserRouteWithChildren
  '/auth/login': typeof AuthLoginRoute
  '/auth/signin': typeof AuthSigninRoute
  '/dashboard_admin/category_management': typeof DashboardadminCategorymanagementRoute
  '/dashboard_admin/category_user': typeof DashboardadminCategoryuserRoute
  '/dashboard_admin/courts_management': typeof DashboardadminCourtsmanagementRoute
  '/dashboard_admin/requests': typeof DashboardadminRequestsRoute
  '/dashboard_admin/role_management': typeof DashboardadminRolemanagementRoute
  '/dashboard_admin/tournament_management': typeof DashboardadminTournamentmanagementRoute
  '/dashboard_admin/training_management': typeof DashboardadminTrainingmanagementRoute
  '/dashboard_admin/user_management': typeof DashboardadminUsermanagementRoute
  '/dashboard_trainer/tournament': typeof DashboardtrainerTournamentRoute
  '/dashboard_trainer/trainings': typeof DashboardtrainerTrainingsRoute
  '/dashboard_trainer/user_categories': typeof DashboardtrainerUsercategoriesRoute
  '/dashboard_user/categories': typeof DashboarduserCategoriesRoute
  '/dashboard_user/requests': typeof DashboarduserRequestsRoute
  '/dashboard_user/tournament': typeof DashboarduserTournamentRoute
  '/dashboard_user/training': typeof DashboarduserTrainingRoute
  '/dashboard_user/tuition': typeof DashboarduserTuitionRoute
  '/dashboard_admin/': typeof DashboardadminIndexRoute
  '/dashboard_trainer/': typeof DashboardtrainerIndexRoute
  '/dashboard_user/': typeof DashboarduserIndexRoute
  '/dashboard_trainer/reports/$userId': typeof DashboardtrainerReportsUserIdRoute
  '/dashboard_trainer/reports': typeof DashboardtrainerReportsIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/signin': typeof AuthSigninRoute
  '/dashboard_admin/category_management': typeof DashboardadminCategorymanagementRoute
  '/dashboard_admin/category_user': typeof DashboardadminCategoryuserRoute
  '/dashboard_admin/courts_management': typeof DashboardadminCourtsmanagementRoute
  '/dashboard_admin/requests': typeof DashboardadminRequestsRoute
  '/dashboard_admin/role_management': typeof DashboardadminRolemanagementRoute
  '/dashboard_admin/tournament_management': typeof DashboardadminTournamentmanagementRoute
  '/dashboard_admin/training_management': typeof DashboardadminTrainingmanagementRoute
  '/dashboard_admin/user_management': typeof DashboardadminUsermanagementRoute
  '/dashboard_trainer/tournament': typeof DashboardtrainerTournamentRoute
  '/dashboard_trainer/trainings': typeof DashboardtrainerTrainingsRoute
  '/dashboard_trainer/user_categories': typeof DashboardtrainerUsercategoriesRoute
  '/dashboard_user/categories': typeof DashboarduserCategoriesRoute
  '/dashboard_user/requests': typeof DashboarduserRequestsRoute
  '/dashboard_user/tournament': typeof DashboarduserTournamentRoute
  '/dashboard_user/training': typeof DashboarduserTrainingRoute
  '/dashboard_user/tuition': typeof DashboarduserTuitionRoute
  '/dashboard_admin': typeof DashboardadminIndexRoute
  '/dashboard_trainer': typeof DashboardtrainerIndexRoute
  '/dashboard_user': typeof DashboarduserIndexRoute
  '/dashboard_trainer/reports/$userId': typeof DashboardtrainerReportsUserIdRoute
  '/dashboard_trainer/reports': typeof DashboardtrainerReportsIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/dashboard_admin': typeof DashboardadminRouteWithChildren
  '/dashboard_trainer': typeof DashboardtrainerRouteWithChildren
  '/dashboard_user': typeof DashboarduserRouteWithChildren
  '/auth/login': typeof AuthLoginRoute
  '/auth/signin': typeof AuthSigninRoute
  '/dashboard_admin/category_management': typeof DashboardadminCategorymanagementRoute
  '/dashboard_admin/category_user': typeof DashboardadminCategoryuserRoute
  '/dashboard_admin/courts_management': typeof DashboardadminCourtsmanagementRoute
  '/dashboard_admin/requests': typeof DashboardadminRequestsRoute
  '/dashboard_admin/role_management': typeof DashboardadminRolemanagementRoute
  '/dashboard_admin/tournament_management': typeof DashboardadminTournamentmanagementRoute
  '/dashboard_admin/training_management': typeof DashboardadminTrainingmanagementRoute
  '/dashboard_admin/user_management': typeof DashboardadminUsermanagementRoute
  '/dashboard_trainer/tournament': typeof DashboardtrainerTournamentRoute
  '/dashboard_trainer/trainings': typeof DashboardtrainerTrainingsRoute
  '/dashboard_trainer/user_categories': typeof DashboardtrainerUsercategoriesRoute
  '/dashboard_user/categories': typeof DashboarduserCategoriesRoute
  '/dashboard_user/requests': typeof DashboarduserRequestsRoute
  '/dashboard_user/tournament': typeof DashboarduserTournamentRoute
  '/dashboard_user/training': typeof DashboarduserTrainingRoute
  '/dashboard_user/tuition': typeof DashboarduserTuitionRoute
  '/dashboard_admin/': typeof DashboardadminIndexRoute
  '/dashboard_trainer/': typeof DashboardtrainerIndexRoute
  '/dashboard_user/': typeof DashboarduserIndexRoute
  '/dashboard_trainer/reports/$userId': typeof DashboardtrainerReportsUserIdRoute
  '/dashboard_trainer/reports/': typeof DashboardtrainerReportsIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/dashboard_admin'
    | '/dashboard_trainer'
    | '/dashboard_user'
    | '/auth/login'
    | '/auth/signin'
    | '/dashboard_admin/category_management'
    | '/dashboard_admin/category_user'
    | '/dashboard_admin/courts_management'
    | '/dashboard_admin/requests'
    | '/dashboard_admin/role_management'
    | '/dashboard_admin/tournament_management'
    | '/dashboard_admin/training_management'
    | '/dashboard_admin/user_management'
    | '/dashboard_trainer/tournament'
    | '/dashboard_trainer/trainings'
    | '/dashboard_trainer/user_categories'
    | '/dashboard_user/categories'
    | '/dashboard_user/requests'
    | '/dashboard_user/tournament'
    | '/dashboard_user/training'
    | '/dashboard_user/tuition'
    | '/dashboard_admin/'
    | '/dashboard_trainer/'
    | '/dashboard_user/'
    | '/dashboard_trainer/reports/$userId'
    | '/dashboard_trainer/reports'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/auth/login'
    | '/auth/signin'
    | '/dashboard_admin/category_management'
    | '/dashboard_admin/category_user'
    | '/dashboard_admin/courts_management'
    | '/dashboard_admin/requests'
    | '/dashboard_admin/role_management'
    | '/dashboard_admin/tournament_management'
    | '/dashboard_admin/training_management'
    | '/dashboard_admin/user_management'
    | '/dashboard_trainer/tournament'
    | '/dashboard_trainer/trainings'
    | '/dashboard_trainer/user_categories'
    | '/dashboard_user/categories'
    | '/dashboard_user/requests'
    | '/dashboard_user/tournament'
    | '/dashboard_user/training'
    | '/dashboard_user/tuition'
    | '/dashboard_admin'
    | '/dashboard_trainer'
    | '/dashboard_user'
    | '/dashboard_trainer/reports/$userId'
    | '/dashboard_trainer/reports'
  id:
    | '__root__'
    | '/'
    | '/dashboard_admin'
    | '/dashboard_trainer'
    | '/dashboard_user'
    | '/auth/login'
    | '/auth/signin'
    | '/dashboard_admin/category_management'
    | '/dashboard_admin/category_user'
    | '/dashboard_admin/courts_management'
    | '/dashboard_admin/requests'
    | '/dashboard_admin/role_management'
    | '/dashboard_admin/tournament_management'
    | '/dashboard_admin/training_management'
    | '/dashboard_admin/user_management'
    | '/dashboard_trainer/tournament'
    | '/dashboard_trainer/trainings'
    | '/dashboard_trainer/user_categories'
    | '/dashboard_user/categories'
    | '/dashboard_user/requests'
    | '/dashboard_user/tournament'
    | '/dashboard_user/training'
    | '/dashboard_user/tuition'
    | '/dashboard_admin/'
    | '/dashboard_trainer/'
    | '/dashboard_user/'
    | '/dashboard_trainer/reports/$userId'
    | '/dashboard_trainer/reports/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  DashboardadminRoute: typeof DashboardadminRouteWithChildren
  DashboardtrainerRoute: typeof DashboardtrainerRouteWithChildren
  DashboarduserRoute: typeof DashboarduserRouteWithChildren
  AuthLoginRoute: typeof AuthLoginRoute
  AuthSigninRoute: typeof AuthSigninRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DashboardadminRoute: DashboardadminRouteWithChildren,
  DashboardtrainerRoute: DashboardtrainerRouteWithChildren,
  DashboarduserRoute: DashboarduserRouteWithChildren,
  AuthLoginRoute: AuthLoginRoute,
  AuthSigninRoute: AuthSigninRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/dashboard_admin",
        "/dashboard_trainer",
        "/dashboard_user",
        "/auth/login",
        "/auth/signin"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/dashboard_admin": {
      "filePath": "dashboard_admin.tsx",
      "children": [
        "/dashboard_admin/category_management",
        "/dashboard_admin/category_user",
        "/dashboard_admin/courts_management",
        "/dashboard_admin/requests",
        "/dashboard_admin/role_management",
        "/dashboard_admin/tournament_management",
        "/dashboard_admin/training_management",
        "/dashboard_admin/user_management",
        "/dashboard_admin/"
      ]
    },
    "/dashboard_trainer": {
      "filePath": "dashboard_trainer.tsx",
      "children": [
        "/dashboard_trainer/tournament",
        "/dashboard_trainer/trainings",
        "/dashboard_trainer/user_categories",
        "/dashboard_trainer/",
        "/dashboard_trainer/reports/$userId",
        "/dashboard_trainer/reports/"
      ]
    },
    "/dashboard_user": {
      "filePath": "dashboard_user.tsx",
      "children": [
        "/dashboard_user/categories",
        "/dashboard_user/requests",
        "/dashboard_user/tournament",
        "/dashboard_user/training",
        "/dashboard_user/tuition",
        "/dashboard_user/"
      ]
    },
    "/auth/login": {
      "filePath": "auth/login.tsx"
    },
    "/auth/signin": {
      "filePath": "auth/signin.tsx"
    },
    "/dashboard_admin/category_management": {
      "filePath": "dashboard_admin/category_management.tsx",
      "parent": "/dashboard_admin"
    },
    "/dashboard_admin/category_user": {
      "filePath": "dashboard_admin/category_user.tsx",
      "parent": "/dashboard_admin"
    },
    "/dashboard_admin/courts_management": {
      "filePath": "dashboard_admin/courts_management.tsx",
      "parent": "/dashboard_admin"
    },
    "/dashboard_admin/requests": {
      "filePath": "dashboard_admin/requests.tsx",
      "parent": "/dashboard_admin"
    },
    "/dashboard_admin/role_management": {
      "filePath": "dashboard_admin/role_management.tsx",
      "parent": "/dashboard_admin"
    },
    "/dashboard_admin/tournament_management": {
      "filePath": "dashboard_admin/tournament_management.tsx",
      "parent": "/dashboard_admin"
    },
    "/dashboard_admin/training_management": {
      "filePath": "dashboard_admin/training_management.tsx",
      "parent": "/dashboard_admin"
    },
    "/dashboard_admin/user_management": {
      "filePath": "dashboard_admin/user_management.tsx",
      "parent": "/dashboard_admin"
    },
    "/dashboard_trainer/tournament": {
      "filePath": "dashboard_trainer/tournament.tsx",
      "parent": "/dashboard_trainer"
    },
    "/dashboard_trainer/trainings": {
      "filePath": "dashboard_trainer/trainings.tsx",
      "parent": "/dashboard_trainer"
    },
    "/dashboard_trainer/user_categories": {
      "filePath": "dashboard_trainer/user_categories.tsx",
      "parent": "/dashboard_trainer"
    },
    "/dashboard_user/categories": {
      "filePath": "dashboard_user/categories.tsx",
      "parent": "/dashboard_user"
    },
    "/dashboard_user/requests": {
      "filePath": "dashboard_user/requests.tsx",
      "parent": "/dashboard_user"
    },
    "/dashboard_user/tournament": {
      "filePath": "dashboard_user/tournament.tsx",
      "parent": "/dashboard_user"
    },
    "/dashboard_user/training": {
      "filePath": "dashboard_user/training.tsx",
      "parent": "/dashboard_user"
    },
    "/dashboard_user/tuition": {
      "filePath": "dashboard_user/tuition.tsx",
      "parent": "/dashboard_user"
    },
    "/dashboard_admin/": {
      "filePath": "dashboard_admin/index.tsx",
      "parent": "/dashboard_admin"
    },
    "/dashboard_trainer/": {
      "filePath": "dashboard_trainer/index.tsx",
      "parent": "/dashboard_trainer"
    },
    "/dashboard_user/": {
      "filePath": "dashboard_user/index.tsx",
      "parent": "/dashboard_user"
    },
    "/dashboard_trainer/reports/$userId": {
      "filePath": "dashboard_trainer/reports/$userId.tsx",
      "parent": "/dashboard_trainer"
    },
    "/dashboard_trainer/reports/": {
      "filePath": "dashboard_trainer/reports/index.tsx",
      "parent": "/dashboard_trainer"
    }
  }
}
ROUTE_MANIFEST_END */
