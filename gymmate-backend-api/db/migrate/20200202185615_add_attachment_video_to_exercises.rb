class AddAttachmentVideoToExercises < ActiveRecord::Migration[5.2]
  def self.up
    change_table :exercises do |t|
      t.attachment :video
    end
  end

  def self.down
    remove_attachment :exercises, :video
  end
end
