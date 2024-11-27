# Changelog

## [1.6.0](https://github.com/TheoEwzZer/Taskify/compare/taskify-v1.5.0...taskify-v1.6.0) (2024-11-27)


### ✨ Features

* add dark mode ([62de09b](https://github.com/TheoEwzZer/Taskify/commit/62de09b030c1b8b4af05dc7f16828fbc59d02fe6))
* add project authorization ([3b36389](https://github.com/TheoEwzZer/Taskify/commit/3b363894e5e6f55d7d4b205c52d3b4c7f559a96f))
* add react-markdown for rendering task descriptions with markdown support ([bc885e0](https://github.com/TheoEwzZer/Taskify/commit/bc885e08e9401eb25827152e311e781cb66ff19e))
* integrate Tiptap editor for enhanced task description formatting ([32cb6b4](https://github.com/TheoEwzZer/Taskify/commit/32cb6b428054270804f00f0ff24d92150dcf753b))


### 🐛 Bug Fixes

* add margin to MemberAvatar component in project and task forms ([0a55270](https://github.com/TheoEwzZer/Taskify/commit/0a552709be20922845077bbc94ac050fe8484c14))
* add margin to MemberAvatar component in project details ([b23c136](https://github.com/TheoEwzZer/Taskify/commit/b23c13640b9e81df7a8571e2d153d1352c63b10a))
* add whitespace handling to task description for better formatting ([6ab6f8a](https://github.com/TheoEwzZer/Taskify/commit/6ab6f8aa8cc38f2735ca6702feed2b088e2374f5))
* implement project access control in home page based on member roles ([5245811](https://github.com/TheoEwzZer/Taskify/commit/5245811e9f25de9a6db8357fad7a9c9339c6edca))
* remove extra grid column for MemberList component ([9e2c7bf](https://github.com/TheoEwzZer/Taskify/commit/9e2c7bff0257045fc876a7ef942c4533c2656335))
* replace FetchEventLike with any in route handlers ([9ad15cc](https://github.com/TheoEwzZer/Taskify/commit/9ad15cc9fbdb947bd9aecc717f632d3a4aaba958))
* update badge component colors for dark mode support ([5e25368](https://github.com/TheoEwzZer/Taskify/commit/5e253689edff5c27490ea144356051d197fac721))
* update buttonRef type to allow null in task form components ([1b57c18](https://github.com/TheoEwzZer/Taskify/commit/1b57c18a1ff30fa72556981782eae064f92cf932))
* update UserButton component for dark mode support ([b75f7c1](https://github.com/TheoEwzZer/Taskify/commit/b75f7c165b0acccf0b0e028ab73c7b38bce4b494))
* upgrade limit to database queries for improved performance ([d18cdc0](https://github.com/TheoEwzZer/Taskify/commit/d18cdc01ae034fe16a8b23e1dc81073a09cd1742))


### ♻️ Code Refactoring

* change let to const for assigneeIds in project route ([fabec1b](https://github.com/TheoEwzZer/Taskify/commit/fabec1be639c7e29be793f6dd3a48e2a23a960bb))


### 💄 Styles

* move member avatar to frist plan when hover ([a758187](https://github.com/TheoEwzZer/Taskify/commit/a758187a3847b655f6bc13f7bff92f9639e6b9ff))


### 📦 Dependencies

* update hono to version 4.6.11 ([dc15520](https://github.com/TheoEwzZer/Taskify/commit/dc15520227b16ec21e5bc7c7b1ac36e1ab23594b))

## [1.5.0](https://github.com/TheoEwzZer/Taskify/compare/taskify-v1.4.1...taskify-v1.5.0) (2024-11-23)


### ✨ Features

* add assignees to project ([c1fe0a1](https://github.com/TheoEwzZer/Taskify/commit/c1fe0a127d6ec9624d345e14ffed8d44ef012f9b))
* add bulk delete functionality for tasks with confirmation dialog ([58cfecc](https://github.com/TheoEwzZer/Taskify/commit/58cfecc088f8c1170d075ff148a53ff748d0c01d))
* add status popover for task status updates in table ([a8117d0](https://github.com/TheoEwzZer/Taskify/commit/a8117d08fef0fdbd1ac9739f74576bf3dee1cb8b))
* display project assignees and their details in project view ([6a704aa](https://github.com/TheoEwzZer/Taskify/commit/6a704aa4b08c6b59d1a5d18a3244d7a9cffbc5f1))
* implement redirect handling for unauthenticated users in workspace join flow ([9af1c42](https://github.com/TheoEwzZer/Taskify/commit/9af1c42f7020c4d9095a57ed655bfa3c1a062830))
* refactor task model to support multiple assignees ([c43f062](https://github.com/TheoEwzZer/Taskify/commit/c43f0621e35deff4d7144622b2110580f8087cd0))
* update task components to support multiple assignees ([903c9a7](https://github.com/TheoEwzZer/Taskify/commit/903c9a796fe1d92c45acac1b05ba37c6f6a352a6))
* update workspace deletion logic to allow non-admin members to leave instead of deleting ([2050146](https://github.com/TheoEwzZer/Taskify/commit/2050146f0414ed47d5d2b83e5db51eb5d9089c91))


### 🐛 Bug Fixes

* adjust delete button size in data table toolbar ([29ab414](https://github.com/TheoEwzZer/Taskify/commit/29ab4147c9d6f6255bc663dc07a7f499c8f4a202))
* improve unauthorized error message for non-admin users ([00324eb](https://github.com/TheoEwzZer/Taskify/commit/00324eb79e9e2a7c5bf6f82f1b388410cc29fd07))
* support multiple assignees for tasks in the task route ([d0bcc01](https://github.com/TheoEwzZer/Taskify/commit/d0bcc01f6492ca048f79a7f3ed028cbde05499d2))
* update delete workspace API response handling to include 404 status ([c2029ea](https://github.com/TheoEwzZer/Taskify/commit/c2029ead9cadbef355955ac04a94c6e56aa53ba3))


### 💄 Styles

* add margin to calendar icon in custom toolbar ([be64132](https://github.com/TheoEwzZer/Taskify/commit/be6413256ef94d38f3802d63f4eded1a67788ff0))
* remove unnecessary background styling from assignee component ([ce12a93](https://github.com/TheoEwzZer/Taskify/commit/ce12a93823735bfa3764a220cd3ca9695d1b9b0d))

## [1.4.1](https://github.com/TheoEwzZer/Taskify/compare/taskify-v1.4.0...taskify-v1.4.1) (2024-11-06)


### ♻️ Code Refactoring

* extract nested ternary operation into an independent statement ([e8a8aad](https://github.com/TheoEwzZer/Taskify/commit/e8a8aadab164d1f985ef62eb45dd4eaea356a7ed))
* move EditProfilModal import for better organization ([54e3301](https://github.com/TheoEwzZer/Taskify/commit/54e3301f5ef04a81c136fd325ac9811dd12ee4b3))
* refactor assignee and project change handlers for clarity and consistency ([97959bf](https://github.com/TheoEwzZer/Taskify/commit/97959bffc2ff5ff90802e4a768f258fd019e917f))
* simplify sidebar open state handling and cookie management ([17202b8](https://github.com/TheoEwzZer/Taskify/commit/17202b8f6f3ea2f07dbb5b7aabf802df8a97dfe2))


### 💄 Styles

* migrate icons to lucide instead of radix-ui ([21aa282](https://github.com/TheoEwzZer/Taskify/commit/21aa282164397d3ea364730f02df99693ad6cf96))


### 📦 Dependencies

* remove @radix-ui/react-icons dependency from package.json ([bdf01eb](https://github.com/TheoEwzZer/Taskify/commit/bdf01eb731416faefb682b6cd5c6cd87f0ccd929))
* update lucide-react to version 0.454.0 ([2e3bd2e](https://github.com/TheoEwzZer/Taskify/commit/2e3bd2eb73e5da00cdb241f73c6f5c35cfdced22))

## [1.4.0](https://github.com/TheoEwzZer/Taskify/compare/taskify-v1.3.0...taskify-v1.4.0) (2024-10-31)


### ✨ Features

* update DataFilters component to include MemberAvatar and ProjectAvatar for better visual representation ([d703245](https://github.com/TheoEwzZer/Taskify/commit/d70324531e1413e9003bd35038e8bc5897f74260))
* update task filters and query to support multiple project, status, and assignee IDs ([3e1394e](https://github.com/TheoEwzZer/Taskify/commit/3e1394ec46562d45d3183ee2e1867c524f65e0be))


### 🐛 Bug Fixes

* add DatePickerFilters component and integrate it into DataFilters for enhanced date selection ([200f5df](https://github.com/TheoEwzZer/Taskify/commit/200f5df362a4ec978492c6189e839d15e67d76f0))
* center align the DataFilters component's className for improved layout ([d063242](https://github.com/TheoEwzZer/Taskify/commit/d063242c11a0864fe364892200b5b462b9adc7f9))
* replace UserIcon with FolderIcon in data filters component ([2d9f14e](https://github.com/TheoEwzZer/Taskify/commit/2d9f14e4d7203a753c9f5fb9133cf483a7a0b9a9))
* simplify CommandDialogProps type definition and clean up CommandInput component ([86142d6](https://github.com/TheoEwzZer/Taskify/commit/86142d6a9f64b6aac70b2792e58eb93a1f26bc28))


### ♻️ Code Refactoring

* refactor code to use only one data picker ([d206463](https://github.com/TheoEwzZer/Taskify/commit/d206463229fe163f54179f2fd10c855ae8497610))


### 💄 Styles

* improve data filters ([bc67bd8](https://github.com/TheoEwzZer/Taskify/commit/bc67bd8827a6123a33c5912ff316d31717459db3))

## [1.3.0](https://github.com/TheoEwzZer/Taskify/compare/taskify-v1.2.0...taskify-v1.3.0) (2024-10-30)


### ✨ Features

* add `delete workspace` functionality ([af52514](https://github.com/TheoEwzZer/Taskify/commit/af525144c43a879c05ca379653d18818b19b69f2))
* add `delete` functionality ([a240870](https://github.com/TheoEwzZer/Taskify/commit/a240870c3f3479559121bb35ee610ba7257aac12))
* add `reset invite` functionality ([85d5836](https://github.com/TheoEwzZer/Taskify/commit/85d58369573fc29050b1578219b81176034b1b7c))
* add default task status ([a403347](https://github.com/TheoEwzZer/Taskify/commit/a403347b1135bd917d86d8cc8d4bde3d04bb9477))
* add description field to CreateTaskForm and EditTaskForm components ([70e8c0b](https://github.com/TheoEwzZer/Taskify/commit/70e8c0bd954407780387f18e35bbbef2e48cf921))
* add kanban update API ([ac65868](https://github.com/TheoEwzZer/Taskify/commit/ac65868fe42f4cbb0af155ddf3d8b194840ab27e))
* add profil editing feature ([10a9378](https://github.com/TheoEwzZer/Taskify/commit/10a9378469d5f7562088b30d605ba91861760499))
* add SidebarMenuAction component to render a menu action within a SidebarMenuItem ([c7814c2](https://github.com/TheoEwzZer/Taskify/commit/c7814c2aa358dfa41142d68ce449381901e9b76d))
* add task page ([297f680](https://github.com/TheoEwzZer/Taskify/commit/297f680af68b72eff9ee8964a688130784a1a85d))
* add task settings ([0bba393](https://github.com/TheoEwzZer/Taskify/commit/0bba393070c3501703f3c6d649251fdf4acf0b18))
* add tasks filtering and visibility toggle ([bf5da84](https://github.com/TheoEwzZer/Taskify/commit/bf5da847f3a44414d0db2d03fb52aa106d416489))
* add workspace projects ([291ff53](https://github.com/TheoEwzZer/Taskify/commit/291ff530552239982a5e1168cc21f4b45a9e805b))
* assignee is now optional ([37decb5](https://github.com/TheoEwzZer/Taskify/commit/37decb5858ffbf9a2569d4cd30095679e18ad28b))
* build dashboard layout ([6bd5efc](https://github.com/TheoEwzZer/Taskify/commit/6bd5efcf32237dc1b7068f3227c8fcdecfac971f))
* build data calendar ([ea99f5e](https://github.com/TheoEwzZer/Taskify/commit/ea99f5ee2215df335981208bd7f95ae2833d99a2))
* build data filters ([adf71c0](https://github.com/TheoEwzZer/Taskify/commit/adf71c05f9323a5ab7748d93c9b04503d34ce3e0))
* build data kanban ([15c5f62](https://github.com/TheoEwzZer/Taskify/commit/15c5f627120349ebe8669e70c63abfa43d22acb4))
* build data table ([99122c4](https://github.com/TheoEwzZer/Taskify/commit/99122c4da7ea869e8d3c56b70beb0a8be443707c))
* build invite system ([66e6590](https://github.com/TheoEwzZer/Taskify/commit/66e65905dff8d40e660feff957ed222eece37a6e))
* build project analytics ([388ad04](https://github.com/TheoEwzZer/Taskify/commit/388ad04edaac76531268f4a2e4f2bf13b9d423ee))
* build project settings ([4b54ad2](https://github.com/TheoEwzZer/Taskify/commit/4b54ad2350b608628c465b6d01a2e8037bdfde12))
* build responsive modal ([5b78b92](https://github.com/TheoEwzZer/Taskify/commit/5b78b92f1406b1824ad77aa28e942a527547359d))
* build session middleware ([412c7d2](https://github.com/TheoEwzZer/Taskify/commit/412c7d245b68c4732ab5863b485c71c273b96144))
* build standalone layout ([3ff142a](https://github.com/TheoEwzZer/Taskify/commit/3ff142a55f4ce7be4291eccb8ba726a572670835))
* build task form ([301a1a7](https://github.com/TheoEwzZer/Taskify/commit/301a1a798346682ae3bbb411065be188f39a1ee3))
* build tasks API ([d8fe193](https://github.com/TheoEwzZer/Taskify/commit/d8fe19325083572e1f6e93680db283abb8bbd1c6))
* build worksapce analytics ([a25623a](https://github.com/TheoEwzZer/Taskify/commit/a25623a9e97ce16c6852e29e15679b9ed97411d3))
* build workspace form ([8bd33c7](https://github.com/TheoEwzZer/Taskify/commit/8bd33c7724ccd10aff4cb06c2301d1afadc7ccf4))
* build workspace settings ([30a2864](https://github.com/TheoEwzZer/Taskify/commit/30a28641b9d8973cb066244308a11f8e2380376b))
* compare with week instead of month in analytics ([5a876c6](https://github.com/TheoEwzZer/Taskify/commit/5a876c66521719b99cef04dc2e04df8ae491ea06))
* create auth API ([540bc59](https://github.com/TheoEwzZer/Taskify/commit/540bc599f9c81b10fc7cfcc48b53bd349abd98b3))
* create auth screens ([5901d4d](https://github.com/TheoEwzZer/Taskify/commit/5901d4d282e6383c0e5a1c4a23b30156d3107cba))
* create workspace members ([3bfeb7e](https://github.com/TheoEwzZer/Taskify/commit/3bfeb7e4ffd0edcb0c9b1062e54947c793e43217))
* create workspace switcher ([a0e83d5](https://github.com/TheoEwzZer/Taskify/commit/a0e83d5db9f287d0720dd1793fd35196c23d5721))
* handle image upload ([a907da6](https://github.com/TheoEwzZer/Taskify/commit/a907da6c3516e25d6327d5b27e7add9761cfbc57))
* implement oauth login ([10a45c6](https://github.com/TheoEwzZer/Taskify/commit/10a45c694618bdffc79ee22d36074f0268e2462b))
* project setup ([60ba5d1](https://github.com/TheoEwzZer/Taskify/commit/60ba5d179fd6ea98f1620c34a61ded44f4ea4aa4))
* protect routes ([f631b54](https://github.com/TheoEwzZer/Taskify/commit/f631b543fc692e917f7dde975ac2d9ed717f3d30))
* refactor workspace invite functionality and add InviteMembersCard component ([8c24c23](https://github.com/TheoEwzZer/Taskify/commit/8c24c23712fb8bb1a68d5fb5fc38a9e08a9cd4cc))
* set up Appwrite & database ([a29955c](https://github.com/TheoEwzZer/Taskify/commit/a29955c154f6cbe82a30b4d8ded6ffa78861c6e0))
* setup up Hono API ([4a00ef1](https://github.com/TheoEwzZer/Taskify/commit/4a00ef16e649f67a04ef3e7910fa30291cb9bbd5))


### 🐛 Bug Fixes

* add weekStartsOn prop to DatePicker component ([a19c35b](https://github.com/TheoEwzZer/Taskify/commit/a19c35b17653fef42048cf3d5dbd7c69101ba905))
* delete tasks, members and projects when deleting a workspace ([ecce45b](https://github.com/TheoEwzZer/Taskify/commit/ecce45bcdd4967d6a8f3d79d1485f526ab838c43))
* fix `Assigned Tasks` analytics not working ([5f6dbfc](https://github.com/TheoEwzZer/Taskify/commit/5f6dbfc46e8b11fce8022daccec592bd749b1488))
* fix add project button not working on mobile ([35144a0](https://github.com/TheoEwzZer/Taskify/commit/35144a0e7a8e97158b8c835ca5c879156484da15))
* fix image URLs in client and task-breadcrumbs components ([4f15c69](https://github.com/TheoEwzZer/Taskify/commit/4f15c69f33143a8981e8841e5e9fa542e057b439))
* handle not found error in project and workspace queries ([6a9dd94](https://github.com/TheoEwzZer/Taskify/commit/6a9dd9408c139002633916b6a5f92f3a9ef0eca3))
* invalidate analytics when needed ([8da0573](https://github.com/TheoEwzZer/Taskify/commit/8da0573d33e518c6a4dc2a8e27a81241e99f4c41))
* resolve build errors ([1ab4e0a](https://github.com/TheoEwzZer/Taskify/commit/1ab4e0a993a73200a8dc449f8966b839ab68de63))
* update condition for rendering responsive modal ([b788985](https://github.com/TheoEwzZer/Taskify/commit/b788985044604ffdf81ef56e2220134fac1acd1e))
* update page layouts to use full height ([dd4d792](https://github.com/TheoEwzZer/Taskify/commit/dd4d7926fad19d701a4cbb84830e16231c2a819a))
* update release-please configuration to use custom config file ([f71e6f3](https://github.com/TheoEwzZer/Taskify/commit/f71e6f3755b002de34c96a63d3c03978d26d3639))
* update sidebar trigger icons size ([b8b8158](https://github.com/TheoEwzZer/Taskify/commit/b8b8158962822657ebdebe978295ef0cd0432989))


### 🔒️ Security

* add max string lenght in validation schemas ([1efa714](https://github.com/TheoEwzZer/Taskify/commit/1efa7143542b5ee0339806e13ff92a786f4bd3bd))


### ♻️ Code Refactoring

* improve data table components including better toolbar, better pagination, and better column header ([ff5c4de](https://github.com/TheoEwzZer/Taskify/commit/ff5c4de02eea56c7fc9f9b277d9ee3d7bb7e167d))
* move table and kanban components in their own folder ([12ffd9b](https://github.com/TheoEwzZer/Taskify/commit/12ffd9bd39aaa12fc713ce4b4f13a7a8ce8d7142))
* refactor code ([d13233f](https://github.com/TheoEwzZer/Taskify/commit/d13233f241f879145b75a787d6b0a7a9d4b5c5f0))
* refactor code ([d354ebe](https://github.com/TheoEwzZer/Taskify/commit/d354ebebea84de45ca8a89383614dc2efc17bcdd))
* refactor loading component to use PageLoader ([7c38281](https://github.com/TheoEwzZer/Taskify/commit/7c38281bdc98db5f9ab5a9da6e628a09d9c76d0c))
* refactor server components and types ([a3a0b38](https://github.com/TheoEwzZer/Taskify/commit/a3a0b384ec026230696ea87c24a7e0e2798c855a))
* refactor server queries ([b61f737](https://github.com/TheoEwzZer/Taskify/commit/b61f737348420a6e3ac509bdf24d9de618939786))
* refactor Sidebar component to use TypeScript types and improve code readability ([27d638d](https://github.com/TheoEwzZer/Taskify/commit/27d638de9734fadab3838dc1b55d8385542154a8))
* remove margin from icons in user button component ([08904ea](https://github.com/TheoEwzZer/Taskify/commit/08904eaa4d7b1fadfa46626edd96ed3ee86cc49d))
* remove search parameter from task fetching and filtering logic ([3da336d](https://github.com/TheoEwzZer/Taskify/commit/3da336da7dd614a6fefffbcacd6fbf7bfb6584f9))
* remove unused dependency and refactor responsive modal ([9dd997c](https://github.com/TheoEwzZer/Taskify/commit/9dd997cd96b37c94c23b94d82fc90446401e5a10))
* update app metadata ([bc3397b](https://github.com/TheoEwzZer/Taskify/commit/bc3397b30ba0dfa9ce6afc2a5a8d0a4f5e3dc922))
* update breakpoints in responsive styles ([7a4dcb3](https://github.com/TheoEwzZer/Taskify/commit/7a4dcb39f19fcc548d64cdc3102d515df2f310c2))
* update button and dropdown-menu components to automatically style icon inside ([03a465b](https://github.com/TheoEwzZer/Taskify/commit/03a465bffd4161179da0076a1b256ff97fda0a81))
* update error page layout to use full screen height ([696b633](https://github.com/TheoEwzZer/Taskify/commit/696b633504a10f8bf91e5fec93fe501d31b7e619))
* update function syntax ([62725ac](https://github.com/TheoEwzZer/Taskify/commit/62725ac6b12674f7f7bbb02a1a0c5db71566e864))
* update onSuccess callbacks to use explicit void return type ([625ef32](https://github.com/TheoEwzZer/Taskify/commit/625ef3291f4eafe8d4eced3ca3a1b61d391572ae))
* update SidebarTrigger component to toggle between open and close icons based on device type ([3aae515](https://github.com/TheoEwzZer/Taskify/commit/3aae5157b6bfeba3547a1429a5668c6bab7a5473))
* update workspace switcher avatar size ([8c50055](https://github.com/TheoEwzZer/Taskify/commit/8c500558e23f8278860a0d3e24c30303137364b9))
* use approriate type ([4a1f537](https://github.com/TheoEwzZer/Taskify/commit/4a1f53761aaab0df932ae941c7012d3c7abe740a))


### 💄 Styles

* add favicon ([2b14277](https://github.com/TheoEwzZer/Taskify/commit/2b14277e1dd0935b8600a3620e1aba6118e1050e))
* improve Logo ([f29cd12](https://github.com/TheoEwzZer/Taskify/commit/f29cd12ac667d24a80ccc6ab63f5e9e018e77ef7))
* improve sidebar ([29aed90](https://github.com/TheoEwzZer/Taskify/commit/29aed90839071b37fdc75a7171dd6327a9f4f578))
* improve sidebar ([e6a7241](https://github.com/TheoEwzZer/Taskify/commit/e6a7241273e07599ab67b8c3f64e5e39d37c9553))
* remove hover accent color in sidebar ([99d28b9](https://github.com/TheoEwzZer/Taskify/commit/99d28b967929fdcb516ba40bee7b38b0014ada86))
* update responsive layout ([b0e5c2d](https://github.com/TheoEwzZer/Taskify/commit/b0e5c2d3416ff21836edfc495b7bdb209dcc76d5))
* update responsive layout in navbar component ([6626f9a](https://github.com/TheoEwzZer/Taskify/commit/6626f9a75abf23fee88c4a900f56bb2c90caf2a2))
* update sidebar trigger icon in navbar component ([3250eba](https://github.com/TheoEwzZer/Taskify/commit/3250ebaf83504236a74eaf80370613ca8a3caeb5))
* update TaskList component layout ([9a08c52](https://github.com/TheoEwzZer/Taskify/commit/9a08c52de768b05c933395f31cd4992749d0921b))
* update workspace switcher layout in navbar component ([e45f1e1](https://github.com/TheoEwzZer/Taskify/commit/e45f1e149805e9ae669b615177979199efb3d831))


### 🔧 Other

* **main:** release 1.0.0 ([471e7c0](https://github.com/TheoEwzZer/Taskify/commit/471e7c055a64554617e6726ed5a56f2e27e46ea6))
* **main:** release 1.1.0 ([4d43b3e](https://github.com/TheoEwzZer/Taskify/commit/4d43b3e8be31db8f91ec02788806993804ff242a))
* **main:** release 1.2.0 ([e43aaac](https://github.com/TheoEwzZer/Taskify/commit/e43aaac3c70b3c50137d925679525ba4bbffe491))


### 📦 Dependencies

* bump @types/node from 20.16.11 to 22.7.5 ([53c8498](https://github.com/TheoEwzZer/Taskify/commit/53c849843275df027db9911a5c03646292415963))
* bump eslint from 8.57.1 to 9.12.0 ([61c5f47](https://github.com/TheoEwzZer/Taskify/commit/61c5f47c499f89f47e0510b74a7e6bc0de6c9eaf))
* bump react-day-picker from 8.10.1 to 9.1.3 ([63a5992](https://github.com/TheoEwzZer/Taskify/commit/63a59927f38022801329fd5dca3e6e056dd7f5ff))
* downgrade react-day-picker version to 8.10. ([0b0322c](https://github.com/TheoEwzZer/Taskify/commit/0b0322c49993dcc03779074bc36ad5741fd1f64c))

## [1.2.0](https://github.com/TheoEwzZer/Taskify/compare/v1.1.0...v1.2.0) (2024-10-29)


### Features

* add default task status ([a403347](https://github.com/TheoEwzZer/Taskify/commit/a403347b1135bd917d86d8cc8d4bde3d04bb9477))
* add tasks filtering and visibility toggle ([bf5da84](https://github.com/TheoEwzZer/Taskify/commit/bf5da847f3a44414d0db2d03fb52aa106d416489))
* refactor workspace invite functionality and add InviteMembersCard component ([8c24c23](https://github.com/TheoEwzZer/Taskify/commit/8c24c23712fb8bb1a68d5fb5fc38a9e08a9cd4cc))

## [1.1.0](https://github.com/TheoEwzZer/Taskify/compare/v1.0.0...v1.1.0) (2024-10-28)


### Features

* add description field to CreateTaskForm and EditTaskForm components ([70e8c0b](https://github.com/TheoEwzZer/Taskify/commit/70e8c0bd954407780387f18e35bbbef2e48cf921))
* add profil editing feature ([10a9378](https://github.com/TheoEwzZer/Taskify/commit/10a9378469d5f7562088b30d605ba91861760499))
* assignee is now optional ([37decb5](https://github.com/TheoEwzZer/Taskify/commit/37decb5858ffbf9a2569d4cd30095679e18ad28b))
* compare with week instead of month in analytics ([5a876c6](https://github.com/TheoEwzZer/Taskify/commit/5a876c66521719b99cef04dc2e04df8ae491ea06))


### Bug Fixes

* fix `Assigned Tasks` analytics not working ([5f6dbfc](https://github.com/TheoEwzZer/Taskify/commit/5f6dbfc46e8b11fce8022daccec592bd749b1488))

## 1.0.0 (2024-10-28)


### Features

* add `delete workspace` functionality ([af52514](https://github.com/TheoEwzZer/Taskify/commit/af525144c43a879c05ca379653d18818b19b69f2))
* add `delete` functionality ([a240870](https://github.com/TheoEwzZer/Taskify/commit/a240870c3f3479559121bb35ee610ba7257aac12))
* add `reset invite` functionality ([85d5836](https://github.com/TheoEwzZer/Taskify/commit/85d58369573fc29050b1578219b81176034b1b7c))
* add kanban update API ([ac65868](https://github.com/TheoEwzZer/Taskify/commit/ac65868fe42f4cbb0af155ddf3d8b194840ab27e))
* add SidebarMenuAction component to render a menu action within a SidebarMenuItem ([c7814c2](https://github.com/TheoEwzZer/Taskify/commit/c7814c2aa358dfa41142d68ce449381901e9b76d))
* add task page ([297f680](https://github.com/TheoEwzZer/Taskify/commit/297f680af68b72eff9ee8964a688130784a1a85d))
* add task settings ([0bba393](https://github.com/TheoEwzZer/Taskify/commit/0bba393070c3501703f3c6d649251fdf4acf0b18))
* add workspace projects ([291ff53](https://github.com/TheoEwzZer/Taskify/commit/291ff530552239982a5e1168cc21f4b45a9e805b))
* build dashboard layout ([6bd5efc](https://github.com/TheoEwzZer/Taskify/commit/6bd5efcf32237dc1b7068f3227c8fcdecfac971f))
* build data calendar ([ea99f5e](https://github.com/TheoEwzZer/Taskify/commit/ea99f5ee2215df335981208bd7f95ae2833d99a2))
* build data filters ([adf71c0](https://github.com/TheoEwzZer/Taskify/commit/adf71c05f9323a5ab7748d93c9b04503d34ce3e0))
* build data kanban ([15c5f62](https://github.com/TheoEwzZer/Taskify/commit/15c5f627120349ebe8669e70c63abfa43d22acb4))
* build data table ([99122c4](https://github.com/TheoEwzZer/Taskify/commit/99122c4da7ea869e8d3c56b70beb0a8be443707c))
* build invite system ([66e6590](https://github.com/TheoEwzZer/Taskify/commit/66e65905dff8d40e660feff957ed222eece37a6e))
* build project analytics ([388ad04](https://github.com/TheoEwzZer/Taskify/commit/388ad04edaac76531268f4a2e4f2bf13b9d423ee))
* build project settings ([4b54ad2](https://github.com/TheoEwzZer/Taskify/commit/4b54ad2350b608628c465b6d01a2e8037bdfde12))
* build responsive modal ([5b78b92](https://github.com/TheoEwzZer/Taskify/commit/5b78b92f1406b1824ad77aa28e942a527547359d))
* build session middleware ([412c7d2](https://github.com/TheoEwzZer/Taskify/commit/412c7d245b68c4732ab5863b485c71c273b96144))
* build standalone layout ([3ff142a](https://github.com/TheoEwzZer/Taskify/commit/3ff142a55f4ce7be4291eccb8ba726a572670835))
* build task form ([301a1a7](https://github.com/TheoEwzZer/Taskify/commit/301a1a798346682ae3bbb411065be188f39a1ee3))
* build tasks API ([d8fe193](https://github.com/TheoEwzZer/Taskify/commit/d8fe19325083572e1f6e93680db283abb8bbd1c6))
* build worksapce analytics ([a25623a](https://github.com/TheoEwzZer/Taskify/commit/a25623a9e97ce16c6852e29e15679b9ed97411d3))
* build workspace form ([8bd33c7](https://github.com/TheoEwzZer/Taskify/commit/8bd33c7724ccd10aff4cb06c2301d1afadc7ccf4))
* build workspace settings ([30a2864](https://github.com/TheoEwzZer/Taskify/commit/30a28641b9d8973cb066244308a11f8e2380376b))
* create auth API ([540bc59](https://github.com/TheoEwzZer/Taskify/commit/540bc599f9c81b10fc7cfcc48b53bd349abd98b3))
* create auth screens ([5901d4d](https://github.com/TheoEwzZer/Taskify/commit/5901d4d282e6383c0e5a1c4a23b30156d3107cba))
* create workspace members ([3bfeb7e](https://github.com/TheoEwzZer/Taskify/commit/3bfeb7e4ffd0edcb0c9b1062e54947c793e43217))
* create workspace switcher ([a0e83d5](https://github.com/TheoEwzZer/Taskify/commit/a0e83d5db9f287d0720dd1793fd35196c23d5721))
* handle image upload ([a907da6](https://github.com/TheoEwzZer/Taskify/commit/a907da6c3516e25d6327d5b27e7add9761cfbc57))
* implement oauth login ([10a45c6](https://github.com/TheoEwzZer/Taskify/commit/10a45c694618bdffc79ee22d36074f0268e2462b))
* project setup ([60ba5d1](https://github.com/TheoEwzZer/Taskify/commit/60ba5d179fd6ea98f1620c34a61ded44f4ea4aa4))
* protect routes ([f631b54](https://github.com/TheoEwzZer/Taskify/commit/f631b543fc692e917f7dde975ac2d9ed717f3d30))
* set up Appwrite & database ([a29955c](https://github.com/TheoEwzZer/Taskify/commit/a29955c154f6cbe82a30b4d8ded6ffa78861c6e0))
* setup up Hono API ([4a00ef1](https://github.com/TheoEwzZer/Taskify/commit/4a00ef16e649f67a04ef3e7910fa30291cb9bbd5))


### Bug Fixes

* add weekStartsOn prop to DatePicker component ([a19c35b](https://github.com/TheoEwzZer/Taskify/commit/a19c35b17653fef42048cf3d5dbd7c69101ba905))
* delete tasks, members and projects when deleting a workspace ([ecce45b](https://github.com/TheoEwzZer/Taskify/commit/ecce45bcdd4967d6a8f3d79d1485f526ab838c43))
* fix add project button not working on mobile ([35144a0](https://github.com/TheoEwzZer/Taskify/commit/35144a0e7a8e97158b8c835ca5c879156484da15))
* fix image URLs in client and task-breadcrumbs components ([4f15c69](https://github.com/TheoEwzZer/Taskify/commit/4f15c69f33143a8981e8841e5e9fa542e057b439))
* handle not found error in project and workspace queries ([6a9dd94](https://github.com/TheoEwzZer/Taskify/commit/6a9dd9408c139002633916b6a5f92f3a9ef0eca3))
* invalidate analytics when needed ([8da0573](https://github.com/TheoEwzZer/Taskify/commit/8da0573d33e518c6a4dc2a8e27a81241e99f4c41))
* resolve build errors ([1ab4e0a](https://github.com/TheoEwzZer/Taskify/commit/1ab4e0a993a73200a8dc449f8966b839ab68de63))
* update condition for rendering responsive modal ([b788985](https://github.com/TheoEwzZer/Taskify/commit/b788985044604ffdf81ef56e2220134fac1acd1e))
* update page layouts to use full height ([dd4d792](https://github.com/TheoEwzZer/Taskify/commit/dd4d7926fad19d701a4cbb84830e16231c2a819a))
* update sidebar trigger icons size ([b8b8158](https://github.com/TheoEwzZer/Taskify/commit/b8b8158962822657ebdebe978295ef0cd0432989))
