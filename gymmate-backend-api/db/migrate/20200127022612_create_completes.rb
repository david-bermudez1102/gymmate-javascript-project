class CreateCompletes < ActiveRecord::Migration[5.2]
  def change
    create_table :completes do |t|
      t.references :user, foreign_key: true
      t.references :completable, polymorphic: true
      t.timestamps
    end
  end
end
