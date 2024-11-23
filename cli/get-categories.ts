import { Colors } from "../deps.ts";
import type { CategoryClassType, LostAction, LostCondition, LostExpression } from "../lib/entities.ts";
import { ErrorMessage, getModule, LOGGER, WarningMessage } from "./misc.ts";
import { findDuplicatesInArray } from "./misc/find-duplicates.ts";
import { ADDON_CATEGORIES_FOLDER_PATH } from "./paths.ts";

interface CategoryModule {
    default: new () => CategoryClassType;
}

async function getCategory(path: string) {
    const module = await getModule<CategoryModule>(path);
    const _class = new module.default();
    const _prototype = _class.constructor.prototype as CategoryClassType;
    return (_prototype) ? _prototype : null;    
}

export async function getCategories() {
    LOGGER.Searching('Searching for categories');

    const categories: CategoryClassType[] = [];
    async function readCategoriesDirectory(path: string) {
        for await (const entry of Deno.readDir(path)) {
            if (entry.isDirectory) {
                await readCategoriesDirectory(`${path}/${entry.name}`);
            }
            if (entry.isFile && entry.name.endsWith('.ts')) {
                try {
                    const Category = await getCategory(`file://${path}/${entry.name}`);
                    // console.log(Category)

                    if (Category !== null) {

                        const {Id, Name, Deprecated, InDevelopment} = Category;

                        if (!InDevelopment) {
                            // LOGGER.Process(`Checking category with Id: ${Colors.magenta(Category.Id)} for issues`);

                            if (Id === '') {
                                LOGGER.Error('build', ErrorMessage.CATEGORY_ID_EMPTY);
                                Deno.exit();
        
                            }
    
                            if (Name === '') {
                                LOGGER.Error('build', ErrorMessage.CATEGORY_NAME_EMPTY);
                                Deno.exit();
                            }
    
                            if (Deprecated) {
                                LOGGER.Warning(`"${Name}" --> ${WarningMessage.CATEGORY_DEPRECATED}`);
                            }
                            // if (!Deprecated) console.log(Category?.Actions.length);
                            Category.Actions.forEach(entity => {
                                const isEntityValid = validateEntity(Category, entity);
                                if (!isEntityValid) {
                                    Deno.exit();
                                }
                            })
    
                            Category.Conditions.forEach(entity => {
                                const isEntityValid = validateEntity(Category, entity);
                                if (!isEntityValid) {
                                    Deno.exit();
                                }
                            })
    
                            Category.Expressions.forEach(entity => {
                                const isEntityValid = validateEntity(Category, entity);
                                if (!isEntityValid) {
                                    Deno.exit();
                                }
                            })
    
                            const isCategoryEntitiesValid = validateCategoryEntities(Category);
    
                            if (!isCategoryEntitiesValid) {
                                Deno.exit();
                            }
    
                            categories.push(Category);
                            LOGGER.Success(`${Colors.green('Successfully')} added category: ${Colors.magenta(entry.name)}`);

                        } else {
                            LOGGER.Warning(`"${Name}" --> ${WarningMessage.CATEGORY_IN_DEVELOPMENT}`);
                        }
    
                    } else {
                        LOGGER.Error('build', `LostCategory variable not found in: ${Colors.bold(Colors.magenta(entry.name))}`, 'Category must be exported with LostCategory variable!');
                        Deno.exit();
                    }
                } catch (error) {
                    LOGGER.Error('build', `Error importing category: ${Colors.bold(Colors.magenta(entry.name))}`, error);
                    Deno.exit();
                }
            }
        }
    }

    await readCategoriesDirectory(ADDON_CATEGORIES_FOLDER_PATH);

    return categories;
}

function validateCategoryEntities(category: CategoryClassType) {
    const actions = category.Actions.map(e => e.Id);
    const conditions = category.Conditions.map(e => e.Id);
    const expressions = category.Expressions.map(e => e.Id);

    let duplicates = findDuplicatesInArray(actions);
    if (duplicates.result) {
        LOGGER.Error('build', ErrorMessage.ACTIONS_ID_DUPLICATED, `Category Id: "${category.Id}", Actions Ids:`, duplicates.items);
        return false;
    }
    duplicates = findDuplicatesInArray(conditions);
    if (duplicates.result) {
        LOGGER.Error('build', ErrorMessage.CONDITIONS_ID_DUPLICATED, `Category Id: "${category.Id}", Conditions Ids:`, duplicates.items);
        return false;
    }
    duplicates = findDuplicatesInArray(expressions);
    if (duplicates.result) {
        LOGGER.Error('build', ErrorMessage.EXPRESSIONS_ID_DUPLICATED, `Category Id: "${category.Id}", Expressions Ids:`, duplicates.items);
        return false;
    }
    return true;
}

function validateEntity(category: CategoryClassType, entity: LostAction | LostCondition | LostExpression) {
    switch (entity.Type) {
        case 'Action':
            if (entity.Id === '') {
                LOGGER.Error('build', ErrorMessage.ACTION_ID_EMPTY, `Category Id: "${category.Id}"`, `Function: "${entity.Options.ScriptName}"`);
                return false;     
            }

            if (entity.Name === '') {
                LOGGER.Error('build', ErrorMessage.ACTION_NAME_EMPTY, `Category Id: "${category.Id}"`, `Function: "${entity.Options.ScriptName}"`);
                return false;       
            }

            if (entity.DisplayText === '') {
                LOGGER.Error('build', ErrorMessage.ACTION_DISPLAY_TEXT_EMPTY, `Category Id: "${category.Id}"`, `Function: "${entity.Options.ScriptName}"`);
                return false;      
            }

            if (entity.Params.length > 0) {
                const isDisplayTextValid = validateDisplayText(entity.Params, entity.DisplayText);

                if (!isDisplayTextValid) {
                    LOGGER.Error('build', ErrorMessage.ACTION_DISPLAY_TEXT_SHOULD_CONTAIN_PLACEHOLDERS, `Category Id: "${category.Id}"`, `Function: "${entity.Options.ScriptName}"`);
                    return false;   
                }
            }
            break;
        case 'Condition':
            if (entity.Id === '') {
                LOGGER.Error('build', ErrorMessage.CONDITION_ID_EMPTY, `Category Id: "${category.Id}"`, `Function: "${entity.Options.ScriptName}"`);
                return false;     
            }

            if (entity.Name === '') {
                LOGGER.Error('build', ErrorMessage.CONDITION_NAME_EMPTY, `Category Id: "${category.Id}"`, `Function: "${entity.Options.ScriptName}"`);
                return false;     
            }

            if (entity.DisplayText === '') {
                LOGGER.Error('build', ErrorMessage.CONDITION_DISPLAY_TEXT_EMPTY, `Category Id: "${category.Id}"`, `Function: "${entity.Options.ScriptName}"`);
                return false;    
            }

            if (entity.Params.length > 0) {
                const isDisplayTextValid = validateDisplayText(entity.Params, entity.DisplayText);

                if (!isDisplayTextValid) {
                    LOGGER.Error('build', ErrorMessage.CONDITION_DISPLAY_TEXT_SHOULD_CONTAIN_PLACEHOLDERS, `Category Id: "${category.Id}"`, `Function: "${entity.Options.ScriptName}"`);
                    return false;   
                }
            }
            break;
        case 'Expression':
            if (entity.Id === '') {
                LOGGER.Error('build', ErrorMessage.EXPRESSION_ID_EMPTY, `Category Id: "${category.Id}"`, `Function: "${entity.Options.ScriptName}"`);
                return false;     
            }

            if (entity.Name === '') {
                LOGGER.Error('build', ErrorMessage.EXPRESSION_NAME_EMPTY, `Category Id: "${category.Id}"`, `Function: "${entity.Options.ScriptName}"`);
                return false;     
            }
            break;
    }
    return true;
}

function validateDisplayText(Params: any[], DisplayText: string) {
    for (let i = 0; i < Params.length; i++) {
        if (!DisplayText.includes(`{${i}}`)) {
            return false;
        }
    }
    return true;
}