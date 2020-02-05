class CreateWorkouts < ActiveRecord::Migration[5.2]
  def change
    create_table :workouts do |t|
      t.references :program, foreign_key: true
      t.references :user, foreign_key: true
      t.boolean :complete
      t.timestamps
    end
  end
end
